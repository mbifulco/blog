import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildFathomBeaconUrl, sendFathomPageview } from './fathom-beacon';

const pageview = {
  siteId: 'ABCDEFGH',
  origin: 'https://mikebifulco.com',
  pathname: '/posts/all-about-ch.md',
  referrer: 'https://chat.openai.com/',
  userAgent: 'ClaudeBot/1.0',
};

describe('buildFathomBeaconUrl', () => {
  it('sends the site, host and path Fathom needs to record a pageview', () => {
    const url = new URL(buildFathomBeaconUrl(pageview));

    expect(url.origin + url.pathname).toBe('https://cdn.usefathom.com/');
    expect(url.searchParams.get('sid')).toBe('ABCDEFGH');
    expect(url.searchParams.get('h')).toBe('https://mikebifulco.com');
    expect(url.searchParams.get('p')).toBe('/posts/all-about-ch.md');
    expect(url.searchParams.get('r')).toBe('https://chat.openai.com/');
    expect(url.searchParams.get('qs')).toBe('{}');
  });

  it('sends an empty referrer rather than omitting it', () => {
    const url = new URL(buildFathomBeaconUrl({ ...pageview, referrer: null }));

    expect(url.searchParams.get('r')).toBe('');
  });
});

describe('sendFathomPageview', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forwards the caller user agent and referrer', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 200 }));

    await expect(sendFathomPageview(pageview)).resolves.toBe(true);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('sid=ABCDEFGH');
    expect(init?.headers).toMatchObject({
      'user-agent': 'ClaudeBot/1.0',
      referer: 'https://chat.openai.com/',
    });
  });

  it('reports a rejected beacon without throwing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 500 })
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(sendFathomPageview(pageview)).resolves.toBe(false);
  });

  it('swallows network failures — analytics must not break a request', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(sendFathomPageview(pageview)).resolves.toBe(false);
  });
});
