import { resend } from '../resend';
import { EmailTags } from './tags';

export const sendSubscriberNotificationEmail = async ({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}) => {
  if (!email) {
    console.error('No email provided');
    return;
  }

  const subject = `🎉 New Subscriber! ${firstName ?? ''} <${email}>`;
  const body = `Congrats! ${[firstName, lastName].filter(Boolean).join(' ')} <${email}> just subscribed to Tiny Improvements`;

  const { data, error } = await resend.emails.send({
    from: '💌 Tiny Improvements Notifications <notifications@mikebifulco.com>',
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
