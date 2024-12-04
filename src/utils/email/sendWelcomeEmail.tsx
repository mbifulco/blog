import { render } from '@react-email/render';

import { resend } from '../resend';
import { WelcomeEmail } from './templates/WelcomeEmail';

export const sendWelcomeEmail = async ({
  firstName,
  email,
}: {
  firstName?: string;
  lastName?: string;
  email: string;
}) => {
  if (!email) {
    console.error('No email provided');
    return;
  }

  const WelcomeMessage = <WelcomeEmail firstName={firstName} />;
  const { data, error } = await resend.emails.send({
    from: '💌 Tiny Improvements <hello@mikebifulco.com>',
    to: [email],
    subject: "Subscription confirmed. I'm so glad you're here!",
    react: WelcomeMessage,
    text: await render(WelcomeMessage, { plainText: true }),
  });

  if (error) {
    console.error('Error sending welcome email:');
    console.error(error);
  }

  return data;
};
