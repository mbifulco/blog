import {
  listBlockedSignups,
  MAX_BLOCKED_SIGNUPS_PER_DAY,
} from '@server/blockedSignups';
import { captureServerEvent } from '@server/posthog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSubscriptionStatus, resend } from '../resend';
import { sendBlockedSignupsDigest } from './sendBlockedSignupsDigest';
import { EmailTags } from './tags';

vi.mock('../resend', () => ({
  resend: { emails: { send: vi.fn() } },
  getSubscriptionStatus: vi.fn(),
}));
vi.mock('@server/blockedSignups', () => ({
  listBlockedSignups: vi.fn(),
  MAX_BLOCKED_SIGNUPS_PER_DAY: 100,
}));
vi.mock('@server/posthog', () => ({ captureServerEvent: vi.fn() }));

const KEY = 'blocked-signups:2026-11-03';

const entry = (email: string) => ({
  email,
  firstName: 'Ann',
  path: '/posts/x',
  reason: '300010',
  at: '2026-11-03T15:00:00Z',
});

const sentHtml = () =>
  vi.mocked(resend.emails.send).mock.calls[0][0].html as string;

describe('sendBlockedSignupsDigest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSubscriptionStatus).mockResolvedValue('not_subscribed');
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: '1' },
      error: null,
    } as never);
  });

  it('sends nothing when there are no entries', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([]);

    expect(await sendBlockedSignupsDigest(KEY)).toEqual({
      sent: false,
      count: 0,
    });
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it('sends one email listing every entry', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([
      entry('a@example.com'),
      entry('b@example.com'),
    ]);

    expect(await sendBlockedSignupsDigest(KEY)).toEqual({
      sent: true,
      count: 2,
    });
    expect(resend.emails.send).toHaveBeenCalledTimes(1);
    const args = vi.mocked(resend.emails.send).mock.calls[0][0];
    expect(args.to).toEqual(['delivered@resend.com']);
    expect(args.subject).toBe('Signups blocked by Turnstile: 2 on 2026-11-03');
    expect(args.tags).toContainEqual(EmailTags.BlockedSignupsDigest);
    expect(sentHtml()).toContain('a@example.com');
    expect(sentHtml()).toContain('b@example.com');
    expect(captureServerEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'newsletter/blocked_digest_sent',
        properties: { count: 2, dateKey: KEY },
      })
    );
  });

  it('marks entries that are already subscribed', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([entry('a@example.com')]);
    vi.mocked(getSubscriptionStatus).mockResolvedValue('subscribed');

    await sendBlockedSignupsDigest(KEY);

    expect(sentHtml()).toContain('already subscribed');
  });

  it('marks an entry unknown when the contact lookup fails', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([entry('a@example.com')]);
    vi.mocked(getSubscriptionStatus).mockRejectedValue(new Error('boom'));

    expect(await sendBlockedSignupsDigest(KEY)).toEqual({
      sent: true,
      count: 1,
    });
    expect(sentHtml()).toContain('unknown');
  });

  it('notes when the daily cap was reached', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue(
      Array.from({ length: MAX_BLOCKED_SIGNUPS_PER_DAY }, (_, i) =>
        entry(`u${i}@example.com`)
      )
    );

    await sendBlockedSignupsDigest(KEY);

    expect(sentHtml()).toContain('daily cap of 100');
  });
});
