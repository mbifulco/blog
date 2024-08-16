import { Resend, Tag } from 'resend';
import { ContactEvent } from 'src/pages/api/inbound_webhooks/resend';
import { z } from 'zod';

import { env } from './env';

const resend = new Resend(env.RESEND_API_KEY);

const EmailTags: Record<string, Tag> = {
  SubscriberNotification: {
    name: 'category',
    value: 'subscriber_notification',
  },
} as const;

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
    const res = await resend.contacts.create({
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      ...subscriber,
    });

    if (!res.data) {
      throw new Error('No data returned');
    }

    if (res.error) {
      throw new Error(`${res.error.name}: ${res.error.message}`);
    }

    if (res.data) {
      // TODO: fire off a welcome email!
      return res.data;
    }
  } catch (error) {
    console.error('Error subscribing:');
    console.error(error);
    throw error;
  }
};

export const sendSubscriberNotificationEmail = async (event: ContactEvent) => {
  if (!event.data.email) {
    console.error('No email provided');
    return;
  }

  const email = event.data.email;
  const firstName = event.data.first_name ? `${event.data.first_name} ` : '';
  const lastName = event.data.last_name ? `${event.data.last_name} ` : '';

  const subject = `🎉 New Subscriber! ${firstName}-${email}`;
  const body = `Congrats!: ${firstName}${lastName}${email} just subscribed to Tiny Improvements`;

  const { data, error } = await resend.emails.send({
    from: '💌 Resend Notifications <notifications@mikebifulco.com>',
    to: [
      process.env.NODE_ENV === 'production'
        ? 'hello@mikebifulco.com'
        : 'delivered@resend.com',
    ],
    subject,
    html: body,
    tags: [EmailTags.SubscriberNotification],
  });

  if (error) {
    console.error('Error sending subscriber notification email:');
    console.error(error);
    throw error;
  }

  return data;
};
