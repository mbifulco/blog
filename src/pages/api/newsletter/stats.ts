// Importing only the necessary types from 'next'
import type { NextRequest } from 'next/server';

// Environment variables should be accessed using the Next.js provided way for Edge Functions
const convertKitApiSecret = process.env.CONVERTKIT_API_SECRET;

type ConvertKitStats = {
  stats: {
    total_subscribers: number;
    open_tracking_enabled: boolean;
    click_tracking_enabled: boolean;
    subscribers_today: number;
    subscribers_yesterday: number;
    subscribers_last_7_days: number;
    subscribers_previous_7_days: number;
    subscribers_last_30_days: number;
    subscribers_previous_30_days: number;
    email_stats_mode: string;
    sent: number;
    clicked: number;
    opened: number;
  };
};
export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ message: 'Only GET requests allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // get newsletter subscriber count from ConvertKit API
  const response = await fetch(
    `https://api.convertkit.com/v3/lifetime_stats?api_secret=${convertKitApiSecret}`
  );
  const json = (await response.json()) as ConvertKitStats;

  const stats = json?.stats;
  if (!stats) {
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const CACHE_TIME_IN_SECONDS = 60 * 5; // 5 minutes
  const subscriberCountResponse = new Response(
    JSON.stringify({ subscriberCount: stats.total_subscribers }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `s-maxage=${CACHE_TIME_IN_SECONDS}`,
      },
    }
  );

  return subscriberCountResponse;
}

export const config = {
  runtime: 'edge',
};
