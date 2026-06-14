import { PostHog } from 'posthog-node';

import { env } from '@utils/env';

let client: PostHog | null = null;

/**
 * Lazily-created PostHog client for server-side event capture.
 *
 * NEXT_PUBLIC_POSTHOG_KEY is required by src/utils/env.ts, so in normal runtime
 * it is always present. The guard below is a defensive no-op for environments
 * where the key isn't configured (e.g. unit tests that mock `@utils/env`),
 * so callers don't throw or hit the network.
 */
function getPostHogClient(): PostHog | null {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) return null;
  if (!client) {
    client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1, // serverless: send immediately rather than batching
      flushInterval: 0,
    });
  }
  return client;
}

type CaptureServerEventArgs = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
};

/**
 * Capture a server-side PostHog event and flush before returning.
 * Failures are swallowed — analytics must never break the request path.
 */
export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: CaptureServerEventArgs): Promise<void> {
  const ph = getPostHogClient();
  if (!ph) return;

  try {
    ph.capture({ distinctId, event, properties });
    await ph.flush();
  } catch (error) {
    console.error('Failed to capture server-side PostHog event:', error);
  }
}
