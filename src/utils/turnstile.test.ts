import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { verifyTurnstileToken } from './turnstile';

// Mock the env module to avoid environment variable validation issues
vi.mock('./env', () => ({
  env: {
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  },
}));

describe('verifyTurnstileToken', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when siteverify responds with success: true', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await verifyTurnstileToken('valid-token');
    expect(result).toBe(true);
  });

  it('returns false when siteverify responds with success: false', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await verifyTurnstileToken('invalid-token');
    expect(result).toBe(false);
    consoleSpy.mockRestore();
  });

  it('returns false when fetch rejects (network error)', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await verifyTurnstileToken('some-token');
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('returns false on a non-OK HTTP status', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ success: true }),
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await verifyTurnstileToken('some-token');
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('includes remoteip in request body when IP is provided', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await verifyTurnstileToken('token', '1.2.3.4');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = new URLSearchParams(init.body as string);
    expect(body.get('remoteip')).toBe('1.2.3.4');
  });

  it('does not include remoteip in request body when no IP is provided', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await verifyTurnstileToken('token');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = new URLSearchParams(init.body as string);
    expect(body.has('remoteip')).toBe(false);
  });

  it('sends the correct URL and token in the request', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await verifyTurnstileToken('my-token');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    );
    const body = new URLSearchParams(init.body as string);
    expect(body.get('response')).toBe('my-token');
    expect(body.get('secret')).toBe('1x0000000000000000000000000000000AA');
  });
});
