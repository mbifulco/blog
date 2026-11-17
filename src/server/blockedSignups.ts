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

export const MAX_BLOCKED_SIGNUPS_PER_DAY = 50;

const RETENTION_SECONDS = 7 * 24 * 60 * 60;

const easternDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York',
});

/** Redis key for the day's blocked signups, bucketed by US Eastern date. */
export function easternDateKey(date: Date): string {
  return `blocked-signups:${easternDateFormat.format(date)}`;
}

// Runs as one Lua script so concurrent reports can't push a day past the cap.
// Returns 1 when stored, 0 for a duplicate email, and -1 when the day is full.
const RECORD_SCRIPT = `
if redis.call('HEXISTS', KEYS[1], ARGV[1]) == 1 then return 0 end
if redis.call('HLEN', KEYS[1]) >= tonumber(ARGV[3]) then return -1 end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
redis.call('EXPIRE', KEYS[1], ARGV[4])
return 1
`;

/**
 * Stores one report per lowercased email per Eastern day; the first report wins.
 * Returns 'full' without storing when the day already holds the maximum and the
 * email is new, and 'duplicate' when the email was already reported.
 */
export async function recordBlockedSignup(
  entry: BlockedSignup
): Promise<'stored' | 'duplicate' | 'full'> {
  const result = await redis.eval<[string, string, number, number], number>(
    RECORD_SCRIPT,
    [easternDateKey(new Date(entry.at))],
    [
      entry.email.toLowerCase(),
      JSON.stringify(entry),
      MAX_BLOCKED_SIGNUPS_PER_DAY,
      RETENTION_SECONDS,
    ]
  );
  if (result === 1) return 'stored';
  return result === -1 ? 'full' : 'duplicate';
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
