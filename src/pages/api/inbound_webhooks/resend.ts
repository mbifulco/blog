import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkBotId } from 'botid/server';
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
  host: env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  flushAt: 1, // flush immediately since this is a serverless function
  flushInterval: 0, // disable periodic flush as well
});

const webhook = new Webhook(env.RESEND_SIGNING_SECRET);

/**
 * Ensures that the event data matches the current audience/segment,
 * to make sure we're only processing events for the current audience, since
 * Resend doesn't support filtering webhook endpoints by audience/segment.
 *
 * Note: Resend renamed "audiences" to "segments" in their new Contacts API.
 * This function supports both the legacy audience_id and new segment_id fields.
 *
 * @param {ContactEventData} data - The event data.
 * @returns {boolean} Whether the event data matches the current audience/segment.
 */
const ensureEventForCurrentAudience = (data: ContactEventData) => {
  // Support both new segment_id and legacy audience_id
  const segmentOrAudienceId = data.segment_id || data.audience_id;

  if (segmentOrAudienceId !== env.RESEND_NEWSLETTER_AUDIENCE_ID) {
    console.info("Event doesn't match current audience/segment:", data);
    return false;
  }
  return true;
};

/**
 * Webhook handler for Resend events.
 *
 * Current webhook events supported:
 * - contact.created, contact.updated, contact.deleted
 * - email.sent, email.delivered, email.bounced, email.clicked, etc.
 */
const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (!method || method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const payload = (await buffer(req)).toString();
    const headers = req.headers as IncomingMessage['headers'] &
      WebhookRequiredHeaders;

    // Verify the webhook signature first to ensure request came from Resend
    const event = webhook.verify(payload, headers) as WebhookEvent;

    // After signature verification, check for bot traffic
    const verification = await checkBotId({
      advancedOptions: {
        headers: req.headers,
      },
    });
    if (verification.isBot) {
      console.warn('Bot detected attempting to access webhook');
      return res.status(403).json({ error: 'Access denied' });
    }

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
            sendSubscriberNotificationEmail({
              email: event.data.email,
              firstName: event.data.first_name,
              lastName: event.data.last_name,
            }),
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

// Type the handler properly for Next.js API routes
const typedHandler = webhookHandler as (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default typedHandler;
