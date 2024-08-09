import { Resend } from 'resend';

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
