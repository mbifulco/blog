import { describe, expect, it } from 'vitest';

import {
  POSTHOG_API_HOST,
  POSTHOG_ASSETS_HOST,
  POSTHOG_CLIENT_PROXY_HOST,
  POSTHOG_LOGS_ENDPOINT,
  POSTHOG_UI_HOST,
} from './hosts';

describe('posthog host constants', () => {
  it('exposes the real PostHog US hosts', () => {
    expect(POSTHOG_API_HOST).toBe('https://us.i.posthog.com');
    expect(POSTHOG_ASSETS_HOST).toBe('https://us-assets.i.posthog.com');
    expect(POSTHOG_UI_HOST).toBe('https://app.posthog.com');
  });

  it('keeps the production client reverse proxy', () => {
    expect(POSTHOG_CLIENT_PROXY_HOST).toBe('https://mikebifulco.com/ingest');
  });

  it('derives the OTLP logs endpoint from the API host', () => {
    expect(POSTHOG_LOGS_ENDPOINT).toBe('https://us.i.posthog.com/i/v1/logs');
  });
});
