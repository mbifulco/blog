import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handlePaginationRedirects, generatePaginationMatchers } from './utils/pagination-redirects';

export function middleware(request: NextRequest) {
  // Handle pagination redirects using centralized logic
  const paginationRedirect = handlePaginationRedirects(request);
  if (paginationRedirect) {
    return paginationRedirect;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: generatePaginationMatchers(),
};