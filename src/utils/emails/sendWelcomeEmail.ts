import { WelcomeEmail } from '../../../transactional/emails/WelcomeEmail';
import { resend } from '../resend';

export const sendWelcomeEmail = async ({
  firstName,
  email,
}: {
  firstName?: string;
  email: string;
}) => {
  if (!email) {
    console.error('No email provided');
    return;
  }

  const { data, error } = await resend.emails.send({
    from: '💌 Tiny Improvements <hello@mikebifulco.com>',
    to: [email],
    subject: "Subscription confirmed. I'm so glad you're here!",
    react: WelcomeEmail({ firstName }),
  });

  if (error) {
    console.error('Error sending welcome email:');
    console.error(error);
  }

  return data;
};
