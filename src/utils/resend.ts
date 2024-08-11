import posthog from 'posthog-js';
import { Resend } from 'resend';
import { z } from 'zod';

import { env } from './env';

const resend = new Resend(env.RESEND_API_KEY);

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

export const subscribe = async (subscriber: SubscribeArgs) => {
  try {
    posthog.capture('api/subscribe/try', {
      subscriber,
    });

    const res = await resend.contacts.create({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      ...subscriber,
    });

    if (!res.data) {
      throw new Error('No data returned');
    }

    if (res.error) {
      throw new Error(`${res.error.name}: ${res.error.message}`);
      posthog.capture('api/subscribe/error', {
        error: res.error,
        subscriber,
      });
    }

    if (res.data) {
      posthog.capture('api/subscribe/success', {
        subscriber,
      });
      return res.data;
    }
  } catch (error) {
    console.error('Error subscribing:');
    console.error(error);
  }
};
