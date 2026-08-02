import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { trackContentRequest } from '@server/analytics/track-content-request';

import { classifyContentRequest } from '@lib/analytics/content-requests';
import { handlePaginationRedirects } from './utils/pagination-redirects';

/** First value of X-Forwarded-For — the client, before any proxy hops. */
const clientIpFrom = (request: NextRequest): string | null =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip');

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // Markdown twins and llms.txt are static files that run no JavaScript, so the
  // PostHog and Fathom snippets on the site never see a request for one. The
  // proxy is the only place they can be counted, and PostHog is the only
  // service that can record them from here (see track-content-request.ts).
  const contentRequest =
    request.method === 'GET'
      ? classifyContentRequest(request.nextUrl.pathname)
      : null;

  if (contentRequest) {
    // waitUntil: the reader gets the file without waiting on analytics.
    event.waitUntil(
      trackContentRequest(contentRequest, {
        origin: request.nextUrl.origin,
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
        ip: clientIpFrom(request),
      })
    );
  }

  // Handle pagination redirects using centralized logic
  const paginationRedirect = handlePaginationRedirects(request);
  if (paginationRedirect) {
    return paginationRedirect;
  }

  return NextResponse.next();
}

export const config = {
  // Note: This matcher array must be a static literal in this file for Next.js static analysis to work
  // If you update pagination routes, also update PAGINATION_MIDDLEWARE_MATCHERS in src/utils/pagination-redirects.ts for consistency.
  // The markdown/llms.txt entries mirror TRACKED_CONTENT_MATCHERS in
  // src/lib/analytics/content-requests.ts — a path missing here is never routed
  // through the proxy and goes uncounted.
  matcher: [
    '/page/:path*',
    '/newsletter/page/:path*',
    '/posts/:slug.md',
    '/newsletter/:slug.md',
    '/llms.txt',
    '/llms-full.txt',
  ],
};
