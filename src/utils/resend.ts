import type { CreateContactResponse } from 'resend';
import { Resend } from 'resend';
import { z } from 'zod';

import { env } from './env';

export const resend = new Resend(env.RESEND_API_KEY);

export const ContactEvents = {
  ContactCreated: 'contact.created',
  ContactDeleted: 'contact.deleted',
  ContactUpdated: 'contact.updated',
} as const;

export const EmailEvents = {
  EmailBounced: 'email.bounced',
  EmailClicked: 'email.clicked',
  EmailComplained: 'email.complained',
  EmailDelivered: 'email.delivered',
  EmailDeliveryDelayed: 'email.delivery_delayed',
  EmailOpened: 'email.opened',
  EmailSent: 'email.sent',
} as const;

export type EmailEventType = (typeof EmailEvents)[keyof typeof EmailEvents];
export type ContactEventType =
  (typeof ContactEvents)[keyof typeof ContactEvents];

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
export type EmailEventData = {
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
export type ContactEventData = {
  audience_id: string;
  created_at: string;
  email: string;
  first_name?: string;
  last_name?: string;
  id: string;
  unsubscribed: boolean;
  updated_at: string;
};

export type EmailEvent = {
  type: EmailEventType;
  data: EmailEventData;
};

export type ContactEvent = {
  type: ContactEventType;
  data: ContactEventData;
};

export type WebhookEvent = EmailEvent | ContactEvent;

export function isContactEvent(event: WebhookEvent): event is ContactEvent {
  if (
    event.type === ContactEvents.ContactCreated ||
    event.type === ContactEvents.ContactUpdated ||
    event.type === ContactEvents.ContactDeleted
  ) {
    return true;
  }
  return false;
}

export function isEmailEvent(event: WebhookEvent): event is EmailEvent {
  if (
    event.type === EmailEvents.EmailBounced ||
    event.type === EmailEvents.EmailClicked ||
    event.type === EmailEvents.EmailComplained ||
    event.type === EmailEvents.EmailDelivered ||
    event.type === EmailEvents.EmailDeliveryDelayed ||
    event.type === EmailEvents.EmailOpened ||
    event.type === EmailEvents.EmailSent
  ) {
    return true;
  }
  return false;
}

export const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type SubscribeArgs = z.infer<typeof subscribeSchema>;

export const getSubscriberCount = async () => {
  try {
    const response = await resend.contacts.list({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
    });

    if (!response.data) {
      throw new Error('No audience data');
    }

    if (response.error) {
      throw new Error(`${response.error.name}: ${response.error.message}`);
    }

    const contacts = response.data.data;
    // filter out unsubscribed contacts
    const subscribedContacts = contacts.filter(
      (contact) => contact.unsubscribed === false
    );
    return subscribedContacts.length;
  } catch (error) {
    console.error('Error getting subscriber count:');
    console.error(error);
  }
};

export const emailIsBad = (email: string) => {
  const badDomains = [
    'mailinator.com',
  ];
  return badDomains.includes(email.split('@')[1]);
};

/**
 * return a "success" response in cases where the email is from a bad domain
 */
export const fakeSubscribe = async (subscriber: SubscribeArgs) => {
  const badDomains = [
    'mailinator.com',
  ];
  if (badDomains.includes(subscriber.email.split('@')[1])) {
    return {
      success: true,
    };
  }
};

export const subscribe = async (subscriber: SubscribeArgs) => {

  // if the email is from a bad domain, return a fake response
  // so the form looks happy and the abuser can buzz off thinking they were successful
  if (emailIsBad(subscriber.email)) {
    return {
      data: {
        id: '123',
      },
      error: null,
    } as CreateContactResponse;
  }

  try {
    const res = await resend.contacts.create({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      ...subscriber,
    });

    if (res.error) {
      throw new Error(`${res.error.name}: ${res.error.message}`);
    }

    return res.data;
  } catch (error) {
    console.error('Error subscribing:');
    console.error(error);
    throw error;
  }
};
