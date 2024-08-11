import posthog from 'posthog-js';
import { Resend } from 'resend';
import { z } from 'zod';

import { env } from './env';

const resend = new Resend(env.RESEND_API_KEY);

export const getSubscriberCount = async () => {
  try {
    const audience = await resend.contacts.list({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
    });

    if (!audience.data) {
      throw new Error('No audience data');
    }

    const contacts = audience.data.data;
    return contacts.length;
  } catch (error) {
    console.error('Error getting subscriber count:');
    console.error(error);
  }
};

export const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type SubscribeArgs = z.infer<typeof subscribeSchema>;

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
