import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  easternDateKey,
  listBlockedSignups,
  recordBlockedSignup,
} from './blockedSignups';
import { redis } from './redis';

vi.mock('./redis', () => ({
  redis: {
    hset: vi.fn(),
    expire: vi.fn(),
    hgetall: vi.fn(),
  },
}));

describe('blockedSignups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(redis.hset).toHaveBeenCalledWith('blocked-signups:2026-11-03', {
      'ann@example.com': expect.any(String),
    });
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
