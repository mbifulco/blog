import type { NextApiRequest, NextApiResponse } from 'next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sendBlockedSignupsDigest } from '@utils/email/sendBlockedSignupsDigest';
import handler from '../pages/api/cron/blocked-signups-digest';

vi.mock('@utils/email/sendBlockedSignupsDigest', () => ({
  sendBlockedSignupsDigest: vi.fn(),
}));
vi.mock('@utils/env', () => ({ env: { CRON_SECRET: 'secret' } }));

const makeRes = () => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
    end: vi.fn(() => res),
    setHeader: vi.fn(() => res),
  };
  return res;
};

const call = (authorization?: string) => {
  const res = makeRes();
  const req = {
    method: 'GET',
    headers: authorization ? { authorization } : {},
  };
  return handler(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse
  ).then(() => res);
};

describe('blocked-signups-digest cron', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(sendBlockedSignupsDigest).mockResolvedValue({
      sent: true,
      count: 3,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('rejects a request without the cron secret', async () => {
    const res = await call('Bearer wrong');

    expect(res.status).toHaveBeenCalledWith(401);
    expect(sendBlockedSignupsDigest).not.toHaveBeenCalled();
  });

  it('sends the digest for the previous Eastern day', async () => {
    vi.setSystemTime(new Date('2026-11-04T13:00:00Z'));

    const res = await call('Bearer secret');

    expect(sendBlockedSignupsDigest).toHaveBeenCalledWith(
      'blocked-signups:2026-11-03'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ sent: true, count: 3 });
  });
});
