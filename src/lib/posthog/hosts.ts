// Single source of truth for PostHog host configuration.
//
// Isomorphic (plain string constants only) so it is safe to import from client
// components, server code, and next.config.mjs (via jiti).

/** Real PostHog US ingestion/API host. Used server-side and for build-time uploads. */
export const POSTHOG_API_HOST = 'https://us.i.posthog.com';

/** PostHog US static-asset host (array/recorder bundles). */
export const POSTHOG_ASSETS_HOST = 'https://us-assets.i.posthog.com';

/** PostHog app UI host, used for the SDK ui_host link-outs. */
export const POSTHOG_UI_HOST = 'https://app.posthog.com';

/**
 * In production, client requests are reverse-proxied through the site so ad
 * blockers do not drop analytics. See the /ingest rewrites in next.config.mjs.
 */
export const POSTHOG_CLIENT_PROXY_HOST = 'https://mikebifulco.com/ingest';

/** OTLP logs ingestion endpoint (see src/server/logging/otel-logs.ts). */
export const POSTHOG_LOGS_ENDPOINT = `${POSTHOG_API_HOST}/i/v1/logs`;
