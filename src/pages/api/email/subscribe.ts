import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_NEWSLETTER_AUDIENCE_ID!;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // check to make sure this request is only coming from this site
  // if (req.headers.origin !== process.env.NEXT_PUBLIC_SITE_URL) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  console.log('req.body', req.body);
  const body = req.body as { email?: string; firstName?: string };

  if (!body) {
    return res.status(400).json({ message: 'Missing body' });
  }

  const { firstName, email } = body;
  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }

  console.log(`Subscribing ${firstName} <${email}> to newsletter`);

  const { data, error } = await resend.contacts.create({
    email,
    first_name: firstName,
    unsubscribed: false,
    audience_id: AUDIENCE_ID,
  });

  if (error) {
    console.error('Error sending email:\n', JSON.stringify(error, null, 2));
    return res.status(400).json(error);
  }

  console.log('Email subscription succeeded:', data);
  res.status(200).json({ message: 'Email subscription succeeded' });
};

export default handler;
