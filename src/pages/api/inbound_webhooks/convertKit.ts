import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { PostHog } from 'posthog-node';
import type { WebhookRequiredHeaders } from 'svix';

import { env } from '@utils/env';
import { resend } from '@utils/resend';

type ConvertKitWebhookEvent = {
  data: {
    type: 'subscriber.subscriber_activate';
    email: string;
    firstName: string;
    lastName: string;
  };
};

const ph = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: 'https://us.i.posthog.com',
  flushAt: 1, // flush immediately since this is a serverless function
  flushInterval: 0, // disable periodic flush as well
});

const webhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (!method || method !== 'POST') {
    console.error('ConvertKit webhook received with invalid method');
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const payload = (await buffer(req)).toString();
    const headers = req.headers as IncomingMessage['headers'] &
      WebhookRequiredHeaders;

    // make sure the secret matches
    if (headers['x-secret'] !== env.CONVERTKIT_WEBHOOK_SECRET) {
      console.log('ConvertKit webhook received with invalid secret');
      return res.status(401).end('Unauthorized');
    }
    // Verify the webhook signature and extract the event
    const event = JSON.parse(payload) as ConvertKitWebhookEvent;

    if (!event.data.type) {
      console.error('ConvertKit webhook received with no event type');
      return res.status(400).end('No event type');
    }

    switch (event.data.type) {
      case 'subscriber.subscriber_activate':
        // new converkit subscriber, sub 'em to Resend
        const { email, firstName, lastName } = event.data;

        try {
          await resend.contacts.create({
            audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
            email,
            firstName,
            lastName,
          });
        } catch (error) {
          console.error('Error subscribing ConvertKit subscriber to Resend:');
          console.error(error);
        }
        break;
      default:
        console.error('ConvertKit Webhook received unknown event type:', event);
    }

    res.status(200).end();
    return;
  } catch (error) {
    res.status(400).send(error);
    return;
  } finally {
    // see https://github.com/PostHog/posthog/issues/13092#issuecomment-1342966441
    await ph.shutdown();
    await new Promise((r) => setTimeout(r, 500));
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default webhooks;
