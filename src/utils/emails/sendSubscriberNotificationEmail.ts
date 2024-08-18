import { resend } from '../resend';
import type { ContactEvent } from '../resend';
import { EmailTags } from './tags';

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
  }

  return data;
};
