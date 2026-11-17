import type { DigestEntry } from './templates/BlockedSignupsDigest';
import { render } from '@react-email/render';
import {
  listBlockedSignups,
  MAX_BLOCKED_SIGNUPS_PER_DAY,
} from '@server/blockedSignups';
import { captureServerEvent } from '@server/posthog';

import { getSubscriptionStatus, resend } from '../resend';
import { EmailTags } from './tags';
import { BlockedSignupsDigest } from './templates/BlockedSignupsDigest';

// Resend rate-limits per team to a few requests per second; this keeps lookups plus the send under 2/s.
export const LOOKUP_DELAY_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** `dateKey` is a `blocked-signups:YYYY-MM-DD` key from `easternDateKey`. */
export async function sendBlockedSignupsDigest(
  dateKey: string
): Promise<{ sent: boolean; count: number }> {
  const signups = await listBlockedSignups(dateKey);
  if (signups.length === 0) return { sent: false, count: 0 };

  const entries: DigestEntry[] = [];
  for (const [index, signup] of signups.entries()) {
    if (index > 0) await sleep(LOOKUP_DELAY_MS);
    entries.push({
      ...signup,
      status: await getSubscriptionStatus(signup.email).catch(
        () => 'unknown' as const
      ),
    });
  }

  if (entries.length > 0) await sleep(LOOKUP_DELAY_MS);

  const date = dateKey.replace('blocked-signups:', '');
  const html = await render(
    <BlockedSignupsDigest
      date={date}
      entries={entries}
      capReached={signups.length >= MAX_BLOCKED_SIGNUPS_PER_DAY}
      maxPerDay={MAX_BLOCKED_SIGNUPS_PER_DAY}
    />
  );

  const { error } = await resend.emails.send({
    from: '💌 Tiny Improvements Notifications <notifications@mikebifulco.com>',
    to: [
      process.env.NODE_ENV === 'production'
        ? 'hello@mikebifulco.com'
        : 'delivered@resend.com',
    ],
    subject: `Signups blocked by Turnstile: ${signups.length} on ${date}`,
    html,
    tags: [EmailTags.BlockedSignupsDigest],
  });

  if (error) {
    console.error('Error sending blocked signups digest:', error);
    return { sent: false, count: signups.length };
  }

  await captureServerEvent({
    distinctId: 'blocked-signups-digest',
    event: 'newsletter/blocked_digest_sent',
    properties: { count: signups.length, dateKey },
  });

  return { sent: true, count: signups.length };
}
