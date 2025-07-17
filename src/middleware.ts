import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle /page redirects
  if (pathname === '/page') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Handle /newsletter/page redirects
  if (pathname === '/newsletter/page') {
    return NextResponse.redirect(new URL('/newsletter', request.url));
  }
  
  // Handle /page/1 redirects
  if (pathname === '/page/1') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Handle /newsletter/page/1 redirects
  if (pathname === '/newsletter/page/1') {
    return NextResponse.redirect(new URL('/newsletter', request.url));
  }
  
  // Handle invalid page numbers for /page/[page]
  const pageMatch = pathname.match(/^\/page\/(.+)$/);
  if (pageMatch) {
    const pageParam = pageMatch[1];
    const page = parseInt(pageParam, 10);
    
    // If not a valid number or less than 1, redirect to home
    if (isNaN(page) || page < 1 || !pageParam.match(/^\d+$/)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // For very high page numbers, we'll let the component handle it
    // since we need to check against actual total pages
  }
  
  // Handle invalid page numbers for /newsletter/page/[page]
  const newsletterPageMatch = pathname.match(/^\/newsletter\/page\/(.+)$/);
  if (newsletterPageMatch) {
    const pageParam = newsletterPageMatch[1];
    const page = parseInt(pageParam, 10);
    
    // If not a valid number or less than 1, redirect to newsletter
    if (isNaN(page) || page < 1 || !pageParam.match(/^\d+$/)) {
      return NextResponse.redirect(new URL('/newsletter', request.url));
    }
    
    // For very high page numbers, we'll let the component handle it
    // since we need to check against actual total pages
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/page/:path*',
    '/newsletter/page/:path*',
  ],
};