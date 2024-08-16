import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { Webhook } from 'svix';
import type { WebhookRequiredHeaders } from 'svix';

import { env } from '@utils/env';
import {
  ContactEvents,
  EmailEvents,
  sendSubscriberNotificationEmail,
} from '@utils/resend';
import type { ContactEventData, WebhookEvent } from '@utils/resend';

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

    // Make sure this webhook is for the current audience.
    // This site uses distinct Resend audiences
    // for localdev / CI vs production, so we need to
    // check the audience ID in the event data before processing.
    if (event.type in ContactEvents) {
      if (!ensureEventForCurrentAudience(event.data as ContactEventData)) {
        return res.status(200).end();
      }
    }

    switch (event.type) {
      case ContactEvents.ContactCreated:
        try {
          // fire off an email to to myself!
          await sendSubscriberNotificationEmail(event);
        } catch (error) {
          console.error('Error sending subscriber notification email:');
          console.error(error);
        }
        break;
      case ContactEvents.ContactDeleted:
      case ContactEvents.ContactUpdated:
        console.log('Unhandled contact event:', event);
        break;
      case EmailEvents.EmailBounced:
      case EmailEvents.EmailClicked:
      case EmailEvents.EmailComplained:
      case EmailEvents.EmailDelivered:
      case EmailEvents.EmailDeliveryDelayed:
      case EmailEvents.EmailOpened:
      case EmailEvents.EmailSent:
        console.log('Unhandled email event:', event);
        break;
      default:
        console.log('Unknown event type:', event);
    }

    res.status(200).end();
    return;
  } catch (error) {
    res.status(400).send(error);
    return;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default webhooks;
