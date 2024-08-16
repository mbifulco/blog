import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { Webhook } from 'svix';
import type { WebhookRequiredHeaders } from 'svix';

import { env } from '@utils/env';
import { sendSubscriberNotificationEmail } from '@utils/resend';

const ContactEvents = {
  ContactCreated: 'contact.created',
  ContactDeleted: 'contact.deleted',
  ContactUpdated: 'contact.updated',
} as const;

const EmailEvents = {
  EmailBounced: 'email.bounced',
  EmailClicked: 'email.clicked',
  EmailComplained: 'email.complained',
  EmailDelivered: 'email.delivered',
  EmailDeliveryDelayed: 'email.delivery_delayed',
  EmailOpened: 'email.opened',
  EmailSent: 'email.sent',
} as const;

type EmailEvent = (typeof EmailEvents)[keyof typeof EmailEvents];
type ContactEvent = (typeof ContactEvents)[keyof typeof ContactEvents];

/**
 * The data structure of the event payload sent by the webhook for events related to emails.
 * @typedef EmailEventData
 * @type {object}
 * @property {string} created_at - The timestamp when the event occurred.
 * @property {string} email_id - The ID of the email.
 * @property {string} from - The email address of the sender.
 * @property {string} subject - The subject of the email.
 * @property {string[]} to - The email address(es) of the recipient(s).
 */
type EmailEventData = {
  created_at: string;
  email_id: string;
  from: string;
  subject: string;
  to: string[];
};

/**
 * The data structure of the event payload sent by the webhook for events related to contacts.
 * @typedef ContactEventData
 * @type {object}
 * @property {string} audience_id - The ID of the audience.
 * @property {string} created_at - The timestamp when the event occurred.
 * @property {string} email - The email address of the contact.
 * @property {string} first_name - The first name of the contact.
 * @property {string} last_name - The last name of the contact.
 * @property {string} id - The Resend ID of the contact.
 * @property {boolean} unsubscribed - Whether the contact has unsubscribed.
 * @property {string} updated_at - The timestamp when the contact was last updated.
 *
 */
type ContactEventData = {
  audience_id: string;
  created_at: string;
  email: string;
  first_name?: string;
  last_name?: string;
  id: string;
  unsubscribed: boolean;
  updated_at: string;
};

export type WebhookEvent =
  | {
      created_at: string;
      type: EmailEvent;
      data: EmailEventData;
    }
  | {
      created_at: string;
      type: ContactEvent;
      data: ContactEventData;
    };

export const webhook = new Webhook(env.RESEND_SIGNING_SECRET);

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

    switch (event.type) {
      case ContactEvents.ContactCreated:
        try {
          // fire off an email to to myself!
          await sendSubscriberNotificationEmail({
            email: event.data.email,
            firstName: event.data.first_name,
            lastName: event.data.last_name,
          });
        } catch (error) {
          console.error('Error sending subscriber notification email:');
          console.error(error);
        }
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

    return res.status(200).end();
  } catch (error) {
    return res.status(400).send(error);
  }
};

export default webhooks;

export const config = {
  api: {
    bodyParser: false,
  },
};
