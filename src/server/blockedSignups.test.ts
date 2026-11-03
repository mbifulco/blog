import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  easternDateKey,
  listBlockedSignups,
  MAX_BLOCKED_SIGNUPS_PER_DAY,
  recordBlockedSignup,
} from './blockedSignups';
import { redis } from './redis';

vi.mock('./redis', () => ({
  redis: {
    eval: vi.fn(),
    hgetall: vi.fn(),
  },
}));

describe('blockedSignups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(redis.eval).mockResolvedValue(1);
  });

  const entry = {
    email: 'new@example.com',
    path: '/a',
    reason: 'x',
    at: '2026-11-03T12:00:00Z',
  };

  it.each([
    [1, 'stored'],
    [0, 'duplicate'],
    [-1, 'full'],
  ])('maps script result %s to %s', async (result, outcome) => {
    vi.mocked(redis.eval).mockResolvedValue(result);

    expect(await recordBlockedSignup(entry)).toBe(outcome);
  });

  it('checks, stores, and expires in a single script call', async () => {
    await recordBlockedSignup({
      email: 'Ann@Example.com',
      path: '/posts/x',
      reason: '300010',
      at: '2026-11-03T12:00:00Z',
    });

    expect(redis.eval).toHaveBeenCalledTimes(1);
    const [script, keys, args] = vi.mocked(redis.eval).mock.calls[0]!;
    expect(script).toMatch(/HEXISTS[\s\S]*HLEN[\s\S]*HSET[\s\S]*EXPIRE/);
    expect(keys).toEqual(['blocked-signups:2026-11-03']);
    expect(args).toEqual([
      'ann@example.com',
      expect.any(String),
      MAX_BLOCKED_SIGNUPS_PER_DAY,
      604800,
    ]);
    expect(JSON.parse(args[1] as string)).toMatchObject({
      email: 'Ann@Example.com',
      reason: '300010',
    });
  });

  it('builds the key from the US Eastern date', () => {
    expect(easternDateKey(new Date('2026-11-04T03:30:00Z'))).toBe(
      'blocked-signups:2026-11-03'
    );
  });

  it('lists stored entries whether Upstash returns strings or objects', async () => {
    const a = { email: 'a@example.com', path: '/a', reason: 'x', at: 't1' };
    const b = { email: 'b@example.com', path: '/b', reason: 'y', at: 't2' };
    vi.mocked(redis.hgetall).mockResolvedValue({
      'a@example.com': JSON.stringify(a),
      'b@example.com': b,
    });

    expect(await listBlockedSignups('blocked-signups:2026-11-03')).toEqual([
      a,
      b,
    ]);
  });

  it('returns an empty list when the key does not exist', async () => {
    vi.mocked(redis.hgetall).mockResolvedValue(null);

    expect(await listBlockedSignups('blocked-signups:2026-11-03')).toEqual([]);
  });
});
