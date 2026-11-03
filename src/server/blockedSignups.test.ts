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
    hsetnx: vi.fn(),
    expire: vi.fn(),
    hgetall: vi.fn(),
    hlen: vi.fn(),
    hexists: vi.fn(),
  },
}));

describe('blockedSignups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(redis.hlen).mockResolvedValue(0);
    vi.mocked(redis.hsetnx).mockResolvedValue(1);
  });

  const entry = {
    email: 'new@example.com',
    path: '/a',
    reason: 'x',
    at: '2026-11-03T12:00:00Z',
  };

  it('refuses a new email once the day is full', async () => {
    vi.mocked(redis.hlen).mockResolvedValue(MAX_BLOCKED_SIGNUPS_PER_DAY);
    vi.mocked(redis.hexists).mockResolvedValue(0);

    expect(await recordBlockedSignup(entry)).toBe('full');
    expect(redis.hsetnx).not.toHaveBeenCalled();
  });

  it('accepts an existing email when the day is full', async () => {
    vi.mocked(redis.hlen).mockResolvedValue(MAX_BLOCKED_SIGNUPS_PER_DAY);
    vi.mocked(redis.hexists).mockResolvedValue(1);
    vi.mocked(redis.hsetnx).mockResolvedValue(0);

    expect(await recordBlockedSignup(entry)).toBe('duplicate');
  });

  it('does not overwrite the first report for an email', async () => {
    vi.mocked(redis.hsetnx).mockResolvedValue(0);

    expect(await recordBlockedSignup({ ...entry, reason: 'second' })).toBe(
      'duplicate'
    );
    expect(redis.hsetnx).toHaveBeenCalledTimes(1);
  });

  it('reports stored for a new entry', async () => {
    expect(await recordBlockedSignup(entry)).toBe('stored');
  });

  it('builds the key from the US Eastern date', () => {
    expect(easternDateKey(new Date('2026-11-04T03:30:00Z'))).toBe(
      'blocked-signups:2026-11-03'
    );
  });

  it('dedupes by lowercased email and sets a 7-day expiry', async () => {
    await recordBlockedSignup({
      email: 'Ann@Example.com',
      path: '/posts/x',
      reason: '300010',
      at: '2026-11-03T12:00:00Z',
    });

    expect(redis.hsetnx).toHaveBeenCalledWith(
      'blocked-signups:2026-11-03',
      'ann@example.com',
      expect.any(String)
    );
    expect(redis.expire).toHaveBeenCalledWith(
      'blocked-signups:2026-11-03',
      604800
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
