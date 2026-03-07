/**
 * Middleware
 *
 * 1. Country redirect: `/` → `/{country}` if cookie exists
 * 2. Auth: protect routes, redirect guests
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_COUNTRIES = ['al', 'ae'];

// Routes that require authentication
const protectedRoutes = ['/profile', '/settings'];

// Routes only for guests (redirect if authenticated)
const guestOnlyRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Country redirect: `/` → `/{country}` ---
  if (pathname === '/') {
    const country = request.cookies.get('country')?.value;
    if (country && VALID_COUNTRIES.includes(country)) {
      return NextResponse.redirect(new URL(`/${country}`, request.url));
    }
    // No cookie → fall through to splash page
    return NextResponse.next();
  }

  // --- Auth checks ---
  const hasAccessToken = request.cookies.has('access_token');

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasAccessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};
