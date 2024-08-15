import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { Webhook } from 'svix';
import type { WebhookRequiredHeaders } from 'svix';

import { env } from '@utils/env';
import { sendSubscriberNotificationEmail } from '@utils/resend';

const WebhookEventTypes = {
  ContactCreated: 'contact.created',
  ContactDeleted: 'contact.deleted',
  ContactUpdated: 'contact.updated',
  EmailBounced: 'email.bounced',
  EmailClicked: 'email.clicked',
  EmailComplained: 'email.complained',
  EmailDelivered: 'email.delivered',
  EmailDeliveryDelayed: 'email.delivery_delayed',
  EmailOpened: 'email.opened',
  EmailSent: 'email.sent',
} as const;

export type WebhookEventType =
  (typeof WebhookEventTypes)[keyof typeof WebhookEventTypes];

export type WebhookEvent = {
  created_at: string;
  data: {
    audience_id: string;
    created_at: string;
    email?: string;
    email_id?: string;
    first_name?: string;
    last_name?: string;
    updated_at?: string;
    from: string;
    subject: string;
    to: string[];
  };
  type: WebhookEventType;
};

export const webhook = new Webhook(env.RESEND_SIGNING_SECRET);

export const config = {
  api: {
    bodyParser: false,
  },
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

    const event = webhook.verify(payload, headers) as WebhookEvent;

    switch (event.type) {
      case WebhookEventTypes.ContactCreated:
        console.log('event:', event);

        try {
          const { data } = event;
          if (!data) return;

          const emailAddress = Array.isArray(data.to) ? data.to[0] : data.to;

          // fire off an email to to myself!
          await sendSubscriberNotificationEmail({
            email: emailAddress,
            firstName: data.first_name,
            lastName: data.last_name,
          });
        } catch (error) {
          console.error('Error sending subscriber notification email:');
          console.error(error);
        }

        break;
      default:
        console.log('Unknown event type:', event.type);
    }

    return res.status(200).end();
  } catch (error) {
    return res.status(400).send(error);
  }
};

export default webhooks;
