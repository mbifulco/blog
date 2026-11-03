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

const RETENTION_SECONDS = 7 * 24 * 60 * 60;

const easternDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York',
});

/** Redis key for the day's blocked signups, bucketed by US Eastern date. */
export function easternDateKey(date: Date): string {
  return `blocked-signups:${easternDateFormat.format(date)}`;
}

/** Stores one report per lowercased email per Eastern day. */
export async function recordBlockedSignup(entry: BlockedSignup): Promise<void> {
  const key = easternDateKey(new Date(entry.at));
  await redis.hset(key, { [entry.email.toLowerCase()]: JSON.stringify(entry) });
  await redis.expire(key, RETENTION_SECONDS);
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
