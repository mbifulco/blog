import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

import { EmailTemplate } from '../../../components/EmailTemplates/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // check to make sure this request is only coming from this site
  if (req.headers.origin !== process.env.NEXT_PUBLIC_SITE_URL) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  check to make sure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { data, error } = await resend.emails.send({
    from: 'Mike Testing on stream <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'Hello world',
    react: EmailTemplate({ firstName: 'Mike' }),
    text: '',
  });

  if (error) {
    console.error('Error sending email:\n', JSON.stringify(error, null, 2));
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};

export default handler;
