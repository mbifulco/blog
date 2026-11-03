import { redis } from './redis';

export type BlockedSignup = {
  email: string;
  firstName?: string;
  source?: string;
  path: string;
  reason: string;
  /** ISO timestamp of the report. */
  at: string;
};

export const MAX_BLOCKED_SIGNUPS_PER_DAY = 100;

const RETENTION_SECONDS = 7 * 24 * 60 * 60;

const easternDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York',
});

/** Redis key for the day's blocked signups, bucketed by US Eastern date. */
export function easternDateKey(date: Date): string {
  return `blocked-signups:${easternDateFormat.format(date)}`;
}

/**
 * Stores one report per lowercased email per Eastern day; the first report wins.
 * Returns 'full' without storing when the day already holds the maximum and the
 * email is new, and 'duplicate' when the email was already reported.
 */
export async function recordBlockedSignup(
  entry: BlockedSignup
): Promise<'stored' | 'duplicate' | 'full'> {
  const key = easternDateKey(new Date(entry.at));
  const field = entry.email.toLowerCase();

  if ((await redis.hlen(key)) >= MAX_BLOCKED_SIGNUPS_PER_DAY) {
    if (!(await redis.hexists(key, field))) return 'full';
  }

  const added = await redis.hsetnx(key, field, JSON.stringify(entry));
  await redis.expire(key, RETENTION_SECONDS);
  return added ? 'stored' : 'duplicate';
}

export async function listBlockedSignups(
  key: string
): Promise<BlockedSignup[]> {
  const stored = await redis.hgetall<Record<string, unknown>>(key);
  if (!stored) return [];

  // Upstash auto-parses JSON values, so entries may come back as objects.
  return Object.values(stored).map((value) =>
    typeof value === 'string'
      ? (JSON.parse(value) as BlockedSignup)
      : (value as BlockedSignup)
  );
}
