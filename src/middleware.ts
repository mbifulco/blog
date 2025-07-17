import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handlePaginationRedirects } from './utils/pagination-redirects';

export function middleware(request: NextRequest) {
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
  matcher: ['/page/:path*', '/newsletter/page/:path*'],
};
