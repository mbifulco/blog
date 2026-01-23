import type { CreateContactResponse } from 'resend';
import { Resend } from 'resend';
import { z } from 'zod';

import { env } from './env';

// Custom response type to handle already subscribed case
export type SubscribeResponse =
  | CreateContactResponse
  | {
      data: null;
      error: {
        name: 'already_subscribed';
        message: string;
      };
    };

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
 * Custom property value type for contact properties.
 */
export type ContactPropertyValue =
  | {
      type: 'string';
      value: string;
    }
  | {
      type: 'number';
      value: number;
    };

/**
 * The data structure of the event payload sent by the webhook for events related to contacts.
 * @typedef ContactEventData
 * @type {object}
 * @property {string} audience_id - The ID of the audience (deprecated - use segment_id).
 * @property {string} segment_id - The ID of the segment (replaces audience_id in new API).
 * @property {string} created_at - The timestamp when the event occurred.
 * @property {string} email - The email address of the contact.
 * @property {string} first_name - The first name of the contact.
 * @property {string} last_name - The last name of the contact.
 * @property {string} id - The Resend ID of the contact.
 * @property {boolean} unsubscribed - Whether the contact has unsubscribed.
 * @property {string} updated_at - The timestamp when the contact was last updated.
 * @property {object} properties - Custom properties for the contact (key-value pairs).
 *
 */
export type ContactEventData = {
  /** @deprecated Use segment_id instead */
  audience_id?: string;
  segment_id?: string;
  created_at: string;
  email: string;
  first_name?: string;
  last_name?: string;
  id: string;
  unsubscribed: boolean;
  updated_at: string;
  properties?: Record<string, ContactPropertyValue>;
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
  // Anti-spam fields (optional for backwards compatibility)
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
});

// Minimum time in milliseconds between form load and submission
// Bots typically submit instantly; real users take at least 3 seconds
const MIN_FORM_SUBMISSION_TIME_MS = 3000;

/**
 * Check if a first name looks like spam (random characters, "abc", etc.)
 * This runs server-side as a second layer of defense
 */
export function isSpamFirstName(name: string | undefined): boolean {
  if (!name || name.length === 0) return false;

  const normalized = name.trim().toLowerCase();

  // Exact match for known spam patterns
  if (normalized === 'abc') return true;

  // Short names with no vowels (2-4 chars like "xyz", "bcdf")
  if (normalized.length >= 2 && normalized.length <= 4) {
    const hasVowel = /[aeiou]/.test(normalized);
    if (!hasVowel) return true;
  }

  // Check for mixed case pattern (e.g., VKvNcRvi, mtpDQVeZaqb)
  const hasMixedCase = /[a-z]/.test(name) && /[A-Z]/.test(name);
  const hasMultipleUpperInMiddle = /[a-z][A-Z]/.test(name);

  // Check for excessive uppercase letters in mixed case names
  const words = name.split(/\s+/);
  const hasExcessiveUppercase = words.some((word) => {
    const uppercaseCount = (word.match(/[A-Z]/g) || []).length;
    const hasMixed = /[a-z]/.test(word) && /[A-Z]/.test(word);
    return hasMixed && uppercaseCount > 2;
  });

  // Check for excessive consonants (>4 in a row)
  const hasExcessiveConsonants =
    /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(name);

  // Check vowel ratio (should have at least 20% vowels in a normal name)
  const vowelCount = (name.match(/[aeiouAEIOU]/g) || []).length;
  const vowelRatio = vowelCount / name.length;
  const hasLowVowelRatio = vowelRatio < 0.2 && name.length > 4;

  return (
    (hasMixedCase && hasMultipleUpperInMiddle) ||
    hasExcessiveConsonants ||
    hasLowVowelRatio ||
    hasExcessiveUppercase
  );
}

/**
 * Check if the form was submitted too quickly (likely a bot)
 */
export function isFormSubmittedTooFast(formLoadedAt: number | undefined): boolean {
  if (!formLoadedAt) return false; // Can't check if no timestamp provided

  const submissionTime = Date.now();
  const timeDiff = submissionTime - formLoadedAt;

  return timeDiff < MIN_FORM_SUBMISSION_TIME_MS;
}

/**
 * Check if honeypot field was filled (should be empty for real users)
 */
export function isHoneypotFilled(honeypot: string | undefined): boolean {
  return Boolean(honeypot && honeypot.length > 0);
}

type SubscribeArgs = z.infer<typeof subscribeSchema>;

export const getSubscriberCount = async () => {
  try {
    const response = await resend.contacts.list({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
    });

    if (response.error) {
      throw new Error(`${response.error.name}: ${response.error.message}`);
    }

    if (!response.data) {
      throw new Error('No audience data');
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
  const badDomains = ['mailinator.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return badDomains.includes(domain);
};

/**
 * return a "success" response in cases where the email is from a bad domain
 */
export const fakeSubscribe = async (subscriber: SubscribeArgs) => {
  const badDomains = ['mailinator.com'];
  const domain = subscriber.email.split('@')[1]?.toLowerCase();
  if (badDomains.includes(domain)) {
    return {
      success: true,
    };
  }
};

export const subscribe = async (
  subscriber: SubscribeArgs
): Promise<SubscribeResponse> => {
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
    // First, check if the contact already exists
    const existingContact = await resend.contacts.get({
      email: subscriber.email,
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
    });

    // If contact exists and is not unsubscribed, return a special response
    if (existingContact.data && !existingContact.data.unsubscribed) {
      return {
        data: null,
        error: {
          name: 'already_subscribed' as const,
          message: `You're already subscribed with ${subscriber.email}! Check your inbox for previous newsletters.`,
        },
      };
    }

    // If contact exists but is unsubscribed, we could potentially update them
    // For now, we'll proceed with creating/updating the contact
    const res = await resend.contacts.create({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      ...subscriber,
    });

    if (res.error) {
      throw new Error(`${res.error.name}: ${res.error.message}`);
    }

    return res;
  } catch (error: unknown) {
    // If the error is that the contact doesn't exist, that's fine - proceed with creation
    const errorObj = error as Error;
    if (
      errorObj?.message?.includes('not_found') ||
      errorObj?.name === 'not_found'
    ) {
      try {
        const res = await resend.contacts.create({
          audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
          ...subscriber,
        });

        if (res.error) {
          throw new Error(`${res.error.name}: ${res.error.message}`);
        }

        return res;
      } catch (createError) {
        console.error('Error creating contact:');
        console.error(createError);
        throw createError;
      }
    }

    console.error('Error subscribing:');
    console.error(error);
    throw error;
  }
};
