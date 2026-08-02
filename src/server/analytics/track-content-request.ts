import { createHash } from 'node:crypto';
import type { TrackedContentRequest } from '@lib/analytics/content-requests';
import { captureServerEvent } from '@server/posthog';

import { classifyUserAgent } from '@lib/analytics/user-agent';
import { env } from '@utils/env';

/**
 * One event covers every machine-readable format; break it down by the `format`
 * property. Named to sit alongside the `markdown_copy_content`,
 * `markdown_copy_link` and `markdown_open` events the Copy as Markdown control
 * sends from the browser.
 */
export const MARKDOWN_PAGE_VIEW_EVENT = 'markdown_page_view';

/** What the proxy knows about the caller, extracted from the request. */
export type ContentRequestContext = {
  /** Origin the file was requested from, e.g. `https://mikebifulco.com`. */
  origin: string;
  userAgent: string | null;
  referrer: string | null;
  /** Client IP, used only to derive a pseudonymous id — never sent onward. */
  ip: string | null;
};

/**
 * Enabled on production deployments only by default, so previews and `next dev`
 * do not pollute the numbers. `SERVER_ANALYTICS=on` forces it on (useful for
 * checking a preview deploy end to end), `off` disables it everywhere.
 */
const serverAnalyticsEnabled = (): boolean => {
  if (env.SERVER_ANALYTICS === 'off') return false;
  if (env.SERVER_ANALYTICS === 'on') return true;
  return env.VERCEL_ENV === 'production';
};

/**
 * A stable id for grouping a single caller's requests: the IP and user agent
 * are hashed together, and the raw IP never leaves the proxy. (The user agent
 * itself is sent on, as `$raw_user_agent` — it is what tells ClaudeBot apart
 * from GPTBot, which is the point of counting these requests.) PostHog person
 * profiles stay off for these events (see `$process_person_profile` below), so
 * this id only ever groups events.
 */
const distinctIdFor = ({ ip, userAgent }: ContentRequestContext): string => {
  const fingerprint = `${ip ?? 'unknown-ip'}|${userAgent ?? 'unknown-ua'}`;
  const hash = createHash('sha256').update(fingerprint).digest('hex');

  return `md-reader:${hash.slice(0, 32)}`;
};

/**
 * Record a request for a markdown twin or llms.txt file in PostHog. Never
 * throws and never blocks the response — the proxy hands this to
 * `event.waitUntil`, and `captureServerEvent` swallows its own failures.
 *
 * PostHog is the only destination. Fathom is a browser-only product: replaying
 * the beacon its embed script sends was tried here and the hits never showed up
 * on the dashboard, so there is nothing to keep. Markdown and llms.txt traffic
 * lives in PostHog alone.
 */
export const trackContentRequest = async (
  contentRequest: TrackedContentRequest,
  context: ContentRequestContext
): Promise<void> => {
  if (!serverAnalyticsEnabled()) return;

  const { format, contentType, slug, path } = contentRequest;
  const { origin, userAgent, referrer } = context;

  try {
    await captureServerEvent({
      distinctId: distinctIdFor(context),
      event: MARKDOWN_PAGE_VIEW_EVENT,
      properties: {
        format,
        content_type: contentType,
        slug,
        path,
        agent_category: classifyUserAgent(userAgent),
        $current_url: `${origin}${path}`,
        $host: new URL(origin).host,
        $pathname: path,
        $referrer: referrer,
        $raw_user_agent: userAgent,
        // These requests are overwhelmingly crawlers, and a person profile per
        // crawler fingerprint would be noise with a bill attached.
        $process_person_profile: false,
        // Without this PostHog would geolocate our own server, not the caller.
        $geoip_disable: true,
      },
    });
  } catch (error) {
    // Belt and braces: `captureServerEvent` swallows its own failures, so this
    // is only reachable if a malformed request gets this far. Either way an
    // analytics problem must not surface as a rejected `waitUntil` promise.
    console.error('Failed to track a machine-readable page view:', error);
  }
};
