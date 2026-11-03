import {
  listBlockedSignups,
  MAX_BLOCKED_SIGNUPS_PER_DAY,
} from '@server/blockedSignups';
import { captureServerEvent } from '@server/posthog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSubscriptionStatus, resend } from '../resend';
import {
  LOOKUP_DELAY_MS,
  sendBlockedSignupsDigest,
} from './sendBlockedSignupsDigest';
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

const run = async () => {
  const pending = sendBlockedSignupsDigest(KEY);
  await vi.runAllTimersAsync();
  return pending;
};

const sentHtml = () =>
  vi.mocked(resend.emails.send).mock.calls[0][0].html as string;

describe('sendBlockedSignupsDigest', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(getSubscriptionStatus).mockResolvedValue('not_subscribed');
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: '1' },
      error: null,
    } as never);
  });

  it('sends nothing when there are no entries', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([]);

    expect(await run()).toEqual({
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

    expect(await run()).toEqual({
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

    await run();

    expect(sentHtml()).toContain('already subscribed');
  });

  it('marks an entry unknown when the contact lookup fails', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([entry('a@example.com')]);
    vi.mocked(getSubscriptionStatus).mockRejectedValue(new Error('boom'));

    expect(await run()).toEqual({
      sent: true,
      count: 1,
    });
    expect(sentHtml()).toContain('unknown');
  });

  it('labels the entries as unverified and shows the source', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([
      { ...entry('a@example.com'), source: 'footer-form' },
    ]);

    await run();

    expect(sentHtml()).toContain('did not pass the spam check');
    expect(sentHtml()).toContain('never add them in bulk');
    expect(sentHtml()).toContain('footer-form');
  });

  it('uses the singular in the preview for one signup', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([entry('a@example.com')]);

    await run();

    expect(sentHtml()).toContain('1 signup blocked by Turnstile');
  });

  it('notes when the daily cap was reached', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue(
      Array.from({ length: MAX_BLOCKED_SIGNUPS_PER_DAY }, (_, i) =>
        entry(`u${i}@example.com`)
      )
    );

    await run();

    expect(sentHtml()).toContain('daily cap of 100');
  });

  it('looks up contacts one at a time, spaced by the delay', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([
      entry('a@example.com'),
      entry('b@example.com'),
    ]);

    const pending = sendBlockedSignupsDigest(KEY);
    await vi.advanceTimersByTimeAsync(0);
    expect(getSubscriptionStatus).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(LOOKUP_DELAY_MS - 1);
    expect(getSubscriptionStatus).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(getSubscriptionStatus).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(LOOKUP_DELAY_MS - 1);
    expect(resend.emails.send).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(resend.emails.send).toHaveBeenCalledTimes(1);
    await pending;
  });

  it('reports not sent and captures no event when the send fails', async () => {
    vi.mocked(listBlockedSignups).mockResolvedValue([entry('a@example.com')]);
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: null,
      error: { name: 'rate_limit_exceeded', message: 'slow down' },
    } as never);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await run()).toEqual({ sent: false, count: 1 });
    expect(captureServerEvent).not.toHaveBeenCalled();
  });
});
