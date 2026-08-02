import type { TrackedContentRequest } from '@lib/analytics/content-requests';
import { captureServerEvent } from '@server/posthog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MARKDOWN_PAGE_VIEW_EVENT,
  trackContentRequest,
} from './track-content-request';

// Mutable so each test can set the deployment environment and kill switch.
const mockEnv = vi.hoisted(() => ({
  VERCEL_ENV: 'production' as string | undefined,
  SERVER_ANALYTICS: 'auto' as 'auto' | 'on' | 'off',
}));

vi.mock('@utils/env', () => ({ env: mockEnv }));
vi.mock('@server/posthog', () => ({ captureServerEvent: vi.fn() }));

const markdownRequest: TrackedContentRequest = {
  format: 'markdown',
  contentType: 'posts',
  slug: 'all-about-ch',
  path: '/posts/all-about-ch.md',
};

const context = {
  origin: 'https://mikebifulco.com',
  userAgent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0)',
  referrer: null,
  ip: '203.0.113.7',
};

describe('trackContentRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.VERCEL_ENV = 'production';
    mockEnv.SERVER_ANALYTICS = 'auto';
  });

  // A console spy left in place would silence errors in every test after it.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('records the request in PostHog', async () => {
    await trackContentRequest(markdownRequest, context);

    expect(captureServerEvent).toHaveBeenCalledTimes(1);
    expect(captureServerEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: MARKDOWN_PAGE_VIEW_EVENT,
        properties: expect.objectContaining({
          format: 'markdown',
          content_type: 'posts',
          slug: 'all-about-ch',
          path: '/posts/all-about-ch.md',
          agent_category: 'ai-agent',
          $current_url: 'https://mikebifulco.com/posts/all-about-ch.md',
          $host: 'mikebifulco.com',
        }),
      })
    );
  });

  it('keeps person profiles and server geolocation out of PostHog', async () => {
    await trackContentRequest(markdownRequest, context);

    const [{ properties }] = vi.mocked(captureServerEvent).mock.calls[0];
    expect(properties).toMatchObject({
      $process_person_profile: false,
      $geoip_disable: true,
    });
  });

  it('identifies callers pseudonymously, never by raw IP', async () => {
    await trackContentRequest(markdownRequest, context);
    const [first] = vi.mocked(captureServerEvent).mock.calls[0];

    await trackContentRequest(markdownRequest, context);
    const [repeat] = vi.mocked(captureServerEvent).mock.calls[1];

    await trackContentRequest(markdownRequest, {
      ...context,
      ip: '198.51.100.4',
    });
    const [other] = vi.mocked(captureServerEvent).mock.calls[2];

    expect(first.distinctId).toMatch(/^md-reader:[0-9a-f]{32}$/);
    expect(first.distinctId).toBe(repeat.distinctId);
    expect(first.distinctId).not.toBe(other.distinctId);
    expect(JSON.stringify(first)).not.toContain('203.0.113.7');
  });

  it('tags the llms.txt files by format', async () => {
    await trackContentRequest(
      {
        format: 'llms-full',
        contentType: null,
        slug: null,
        path: '/llms-full.txt',
      },
      context
    );

    expect(captureServerEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          format: 'llms-full',
          content_type: null,
          path: '/llms-full.txt',
        }),
      })
    );
  });

  it('stays quiet outside production by default', async () => {
    mockEnv.VERCEL_ENV = 'preview';

    await trackContentRequest(markdownRequest, context);

    expect(captureServerEvent).not.toHaveBeenCalled();
  });

  it('can be forced on for a preview deploy', async () => {
    mockEnv.VERCEL_ENV = 'preview';
    mockEnv.SERVER_ANALYTICS = 'on';

    await trackContentRequest(markdownRequest, context);

    expect(captureServerEvent).toHaveBeenCalledTimes(1);
  });

  it('can be turned off entirely', async () => {
    mockEnv.SERVER_ANALYTICS = 'off';

    await trackContentRequest(markdownRequest, context);

    expect(captureServerEvent).not.toHaveBeenCalled();
  });

  it('never rejects, so a bad request cannot break waitUntil', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      trackContentRequest(markdownRequest, { ...context, origin: 'not-a-url' })
    ).resolves.toBeUndefined();
  });

  it('swallows a PostHog capture failure', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    vi.mocked(captureServerEvent).mockRejectedValueOnce(new Error('down'));

    await expect(
      trackContentRequest(markdownRequest, context)
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalled();
  });
});
