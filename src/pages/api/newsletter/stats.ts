import type { NextApiRequest, NextApiResponse } from 'next';

import { env } from '@utils/env.mjs';

type ResponseData = {
  subscriberCount: number;
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  // get newsletter subscriber count from ConvertKit API
  const response = await fetch(
    `https://api.convertkit.com/v3/lifetime_stats?api_secret=${env.CONVERTKIT_API_SECRET}`
  );
  const json = (await response.json()) as {
    stats: { total_subscribers: number };
  };

  const { stats } = json;
  if (!stats) {
    res.status(500).send({ message: 'Something went wrong' });
    return;
  }

  const CACHE_TIME_IN_SECONDS = 60 * 5; // 5 minutes
  res.setHeader('Cache-Control', `s-maxage=${CACHE_TIME_IN_SECONDS}`);
  res.status(200).json({
    subscriberCount: stats.total_subscribers,
  });
}
