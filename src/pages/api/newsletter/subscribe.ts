// Importing only the necessary types from 'next'
import type { NextRequest } from 'next/server';
import posthog from 'posthog-js';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Only POST requests allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // subscribe!
  try {
    const body = await req.json();
    const response = await fetch(
      `https://app.convertkit.com/forms/3923746/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.CONVERTKIT_API_KEY}`,
        },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          ...body,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'An error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const config = {
  runtime: 'edge',
};
