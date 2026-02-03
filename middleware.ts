/**
 * Middleware for JWT Authentication - Phase 4
 *
 * Simple cookie-based authentication check
 * - Protects routes that require authentication
 * - Redirects unauthenticated users to login
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/settings',
  '/listings/create',
  '/admin',
];

// Routes only for guests (redirect if authenticated)
const guestOnlyRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has access token cookie (basic check)
  const hasAccessToken = request.cookies.has('access_token');

  // Protect routes that require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasAccessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login/register
  if (guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/listings/create',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
