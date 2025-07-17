import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type PaginationRoute = {
  /** The base path (e.g., '/' for home, '/newsletter' for newsletter) */
  basePath: string;
  /** The pagination path pattern (e.g., '/page', '/newsletter/page') */
  paginationPath: string;
};

export const PAGINATION_ROUTES: PaginationRoute[] = [
  {
    basePath: '/',
    paginationPath: '/page',
  },
  {
    basePath: '/newsletter',
    paginationPath: '/newsletter/page',
  },
];

/**
 * Generates Next.js config redirects for pagination routes
 */
export function generatePaginationConfigRedirects() {
  return PAGINATION_ROUTES.map(({ basePath, paginationPath }) => ({
    source: paginationPath,
    destination: basePath,
    permanent: true,
  }));
}

/**
 * Handles pagination redirects in middleware
 */
export function handlePaginationRedirects(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl;

  for (const { basePath, paginationPath } of PAGINATION_ROUTES) {
    // Handle exact pagination path (e.g., /page, /newsletter/page)
    if (pathname === paginationPath) {
      return NextResponse.redirect(new URL(basePath, request.url));
    }

    // Handle /page/1 style redirects
    if (pathname === `${paginationPath}/1`) {
      return NextResponse.redirect(new URL(basePath, request.url));
    }

    // Handle invalid page numbers
    const pageMatch = pathname.match(new RegExp(`^${paginationPath}/(.+)$`));
    if (pageMatch) {
      const pageParam = pageMatch[1];
      const page = parseInt(pageParam, 10);

      // If not a valid number or less than 1, redirect to base path
      if (isNaN(page) || page < 1 || !pageParam.match(/^\d+$/)) {
        return NextResponse.redirect(new URL(basePath, request.url));
      }

      // For valid page numbers > 1, let the component handle it
      // since we need to check against actual total pages
    }
  }

  return null;
}

/**
 * Generates middleware matcher patterns for pagination routes
 */
export function generatePaginationMatchers(): string[] {
  return PAGINATION_ROUTES.map(
    ({ paginationPath }) => `${paginationPath}/:path*`
  );
}

/**
 * Generates server-side redirect props for page-level redirects
 */
export function createPaginationRedirectProps(basePath: string) {
  return {
    redirect: {
      destination: basePath,
      permanent: false,
    },
  };
}
