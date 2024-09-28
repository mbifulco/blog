import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { PostHog } from 'posthog-node';
import { Webhook } from 'svix';
import type { WebhookRequiredHeaders } from 'svix';

import { sendSubscriberNotificationEmail } from '@utils/email/sendSubscriberNotificationEmail';
import { sendWelcomeEmail } from '@utils/email/sendWelcomeEmail';
import { env } from '@utils/env';
import {
  ContactEvents,
  EmailEvents,
  isContactEvent,
  isEmailEvent,
} from '@utils/resend';
import type { ContactEventData, WebhookEvent } from '@utils/resend';

const ph = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: 'https://us.i.posthog.com',
  flushAt: 1, // flush immediately since this is a serverless function
  flushInterval: 0, // disable periodic flush as well
});

const webhook = new Webhook(env.RESEND_SIGNING_SECRET);

/**
 * Ensures that the event data matches the current audience,
 * to make sure we're only processing events for the current audience, since
 * Resend doesn't support filtering webhook endpoints by audience.
 * @param {ContactEventData} data - The event data.
 * @returns {boolean} Whether the event data matches the current audience.
 */
const ensureEventForCurrentAudience = (data: ContactEventData) => {
  if (data.audience_id !== env.RESEND_NEWSLETTER_AUDIENCE_ID) {
    console.info("Event doesn't match current audience:", data);
    return false;
  }
  return true;
};

const webhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (!method || method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const payload = (await buffer(req)).toString();
    const headers = req.headers as IncomingMessage['headers'] &
      WebhookRequiredHeaders;

    // Verify the webhook signature and extract the event
    const event = webhook.verify(payload, headers) as WebhookEvent;

    if (isEmailEvent(event)) {
      const id = Array.isArray(event.data.to)
        ? event.data.to[0]
        : event.data.to;
      ph.capture({
        distinctId: id,
        event: `resend/${event.type}`,
        properties: event.data,
      });
      await ph.flush();
    }

    if (isContactEvent(event)) {
      // Make sure this webhook is for the current audience.
      // This site uses distinct Resend audiences
      // for localdev / CI vs production, so we need to
      // check the audience ID in the event data before processing.
      if (!ensureEventForCurrentAudience(event.data)) {
        return res.status(200).end();
      }

      // Track the contact event in PostHog
      ph.capture({
        distinctId: event.data.email ?? event.data.id,
        event: `resend/${event.type}`,
        properties: event.data,
      });
      await ph.flush();
    }

    switch (event.type) {
      // Contact events
      case ContactEvents.ContactCreated:
        try {
          // fire off an email to to myself!
          const responses = await Promise.allSettled([
            sendSubscriberNotificationEmail(event),
            sendWelcomeEmail({
              email: event.data.email,
              firstName: event.data.first_name,
            }),
          ]);
          if (responses.some((r) => r.status === 'rejected')) {
            console.error('Error sending new subscriber emails:');
            console.error(responses);
          }
        } catch (error) {
          console.error('Error sending new subscriber emails:');
          console.error(error);
        }
        break;
      case ContactEvents.ContactDeleted:
      case ContactEvents.ContactUpdated:
        break;

      // Email events
      case EmailEvents.EmailBounced:
      case EmailEvents.EmailClicked:
      case EmailEvents.EmailComplained:
      case EmailEvents.EmailDelivered:
      case EmailEvents.EmailDeliveryDelayed:
      case EmailEvents.EmailOpened:
      case EmailEvents.EmailSent:
        break;
      default:
        console.log('Unknown event type:', event);
    }

    res.status(200).end();
    return;
  } catch (error) {
    res.status(400).send(error);
    return;
  } finally {
    // see https://github.com/PostHog/posthog/issues/13092#issuecomment-1342966441
    await ph.shutdown();
    await new Promise((r) => setTimeout(r, 500));
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default webhooks;
