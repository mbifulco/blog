import { NextRequest } from 'next/server';
import { trackContentRequest } from '@server/analytics/track-content-request';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TRACKED_CONTENT_MATCHERS } from '@lib/analytics/content-requests';
import { config, proxy } from './proxy';

vi.mock('@server/analytics/track-content-request', () => ({
  trackContentRequest: vi.fn().mockResolvedValue(undefined),
}));

const fetchEvent = () =>
  ({ waitUntil: vi.fn() }) as unknown as Parameters<typeof proxy>[1] & {
    waitUntil: ReturnType<typeof vi.fn>;
  };

const requestFor = (
  path: string,
  {
    method = 'GET',
    headers = {},
  }: { method?: string; headers?: HeadersInit } = {}
) =>
  new NextRequest(new URL(path, 'https://mikebifulco.com'), {
    method,
    headers,
  });

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches every path the tracker recognises', () => {
    // Next.js requires `config.matcher` to be a static literal, so this is what
    // keeps it honest against the tracked paths.
    for (const matcher of TRACKED_CONTENT_MATCHERS) {
      expect(config.matcher).toContain(matcher);
    }
  });

  it('tracks a markdown twin request with the caller details', () => {
    const event = fetchEvent();

    proxy(
      requestFor('/posts/all-about-ch.md', {
        headers: {
          'user-agent': 'ClaudeBot/1.0',
          referer: 'https://claude.ai/',
          'x-forwarded-for': '203.0.113.7, 70.41.3.18',
        },
      }),
      event
    );

    expect(event.waitUntil).toHaveBeenCalledTimes(1);
    expect(trackContentRequest).toHaveBeenCalledWith(
      {
        format: 'markdown',
        contentType: 'posts',
        slug: 'all-about-ch',
        path: '/posts/all-about-ch.md',
      },
      {
        origin: 'https://mikebifulco.com',
        userAgent: 'ClaudeBot/1.0',
        referrer: 'https://claude.ai/',
        // The client, not the proxy hops behind it.
        ip: '203.0.113.7',
      }
    );
  });

  it('tracks llms.txt requests', () => {
    proxy(requestFor('/llms-full.txt'), fetchEvent());

    expect(trackContentRequest).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'llms-full' }),
      expect.anything()
    );
  });

  it('ignores html pages and non-GET requests', () => {
    proxy(requestFor('/posts/all-about-ch'), fetchEvent());
    proxy(
      requestFor('/posts/all-about-ch.md', { method: 'POST' }),
      fetchEvent()
    );

    expect(trackContentRequest).not.toHaveBeenCalled();
  });

  it('still redirects pagination routes', () => {
    const response = proxy(requestFor('/page/1'), fetchEvent());

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe('https://mikebifulco.com/');
    expect(trackContentRequest).not.toHaveBeenCalled();
  });
});
