import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { env } from '@utils/env';

// Initialize Redis client
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// Newsletter subscribe rate limiter: 5 requests per 10 minutes per IP
export const subscribeRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: 'ratelimit:newsletter:subscribe',
});

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

/**
 * Check if an IP has exceeded the rate limit for newsletter subscriptions
 */
export async function checkSubscribeRateLimit(
  ip: string
): Promise<RateLimitResult> {
  const result = await subscribeRateLimiter.limit(ip);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
