import { beforeEach, describe, expect, it, vi } from 'vitest';

import type * as ResendModule from '@utils/resend';
import { subscribe } from '@utils/resend';
import { verifyTurnstileToken } from '@utils/turnstile';
import { createContextInner } from '../context';
import { mailingListRouter } from './mailingList';

// Avoid t3-env throwing when the real resend module reads env vars on import.
vi.mock('@utils/env', () => ({
  env: {
    RESEND_API_KEY: 'test-resend-key',
    RESEND_NEWSLETTER_AUDIENCE_ID: 'test-audience-id',
    RESEND_SIGNING_SECRET: 'test-signing-secret',
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  },
}));

// Avoid the real Resend SDK making network calls at import/usage time.
vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return {
      contacts: {
        get: vi.fn(),
        create: vi.fn(),
        remove: vi.fn(),
        list: vi.fn(),
      },
    };
  }),
}));

// Control Turnstile verification.
vi.mock('@utils/turnstile', () => ({
  verifyTurnstileToken: vi.fn(),
}));

// Server-side analytics is a no-op in tests.
vi.mock('../posthog', () => ({
  captureServerEvent: vi.fn(),
}));

// Stub the network-touching pieces of resend while keeping the real
// schema + spam-detection helpers (which are pure).
vi.mock('@utils/resend', async (importOriginal) => {
  const actual = await importOriginal<typeof ResendModule>();
  return {
    ...actual,
    subscribe: vi.fn(),
  };
});

// Rate limiter always passes in these tests.
vi.mock('../rateLimit', () => ({
  checkSubscribeRateLimit: vi.fn().mockResolvedValue({
    success: true,
    limit: 5,
    remaining: 5,
    reset: 0,
  }),
}));

const verifyTurnstileTokenMock = vi.mocked(verifyTurnstileToken);
const subscribeMock = vi.mocked(subscribe);

type CtxOverrides = {
  clientIp?: string | null;
  requestOrigin?: string | null;
  requestHost?: string | null;
};

const makeCaller = (overrides: CtxOverrides = {}) => {
  const ctx = createContextInner({
    clientIp: overrides.clientIp ?? '1.2.3.4',
    requestOrigin:
      overrides.requestOrigin === undefined ? null : overrides.requestOrigin,
    requestHost:
      overrides.requestHost === undefined ? null : overrides.requestHost,
  });
  return mailingListRouter.createCaller(ctx);
};

describe('mailingListRouter.subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    subscribeMock.mockResolvedValue({
      data: { object: 'contact', id: 'real-contact-id' },
      error: null,
      headers: null,
    });
  });

  it('returns fake success and does not verify or subscribe when the token is missing', async () => {
    const caller = makeCaller();

    const result = await caller.subscribe({ email: 'human@example.com' });

    expect(result).toEqual({ data: { id: 'fake-success' }, error: null });
    expect(verifyTurnstileTokenMock).not.toHaveBeenCalled();
    expect(subscribeMock).not.toHaveBeenCalled();
  });

  it('throws FORBIDDEN when Turnstile verification fails', async () => {
    verifyTurnstileTokenMock.mockResolvedValue(false);
    const caller = makeCaller();

    await expect(
      caller.subscribe({
        email: 'human@example.com',
        turnstileToken: 'expired-token',
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });

    expect(subscribeMock).not.toHaveBeenCalled();
  });

  it('subscribes once when verification passes and origin is null', async () => {
    verifyTurnstileTokenMock.mockResolvedValue(true);
    const caller = makeCaller({ requestOrigin: null });

    const result = await caller.subscribe({
      email: 'human@example.com',
      firstName: 'Real',
      lastName: 'Person',
      turnstileToken: 'good-token',
    });

    expect(verifyTurnstileTokenMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock).toHaveBeenCalledTimes(1);
    expect(subscribeMock).toHaveBeenCalledWith({
      email: 'human@example.com',
      firstName: 'Real',
      lastName: 'Person',
    });
    expect(result).toEqual({ data: { id: 'real-contact-id' }, error: null });
  });

  it('subscribes once when verification passes and origin is same-host', async () => {
    verifyTurnstileTokenMock.mockResolvedValue(true);
    const caller = makeCaller({
      requestOrigin: 'https://mikebifulco.com',
      requestHost: 'mikebifulco.com',
    });

    await caller.subscribe({
      email: 'human@example.com',
      turnstileToken: 'good-token',
    });

    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });

  it('returns fake success without verifying or subscribing for a disallowed origin', async () => {
    verifyTurnstileTokenMock.mockResolvedValue(true);
    const caller = makeCaller({
      requestOrigin: 'https://evil.com',
      requestHost: 'mikebifulco.com',
    });

    const result = await caller.subscribe({
      email: 'human@example.com',
      turnstileToken: 'good-token',
    });

    expect(result).toEqual({ data: { id: 'fake-success' }, error: null });
    expect(verifyTurnstileTokenMock).not.toHaveBeenCalled();
    expect(subscribeMock).not.toHaveBeenCalled();
  });
});
