import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_MANAGEMENT_PATHS = [
  '/admin',
  '/api/admin',
  '/manage',
  '/api/manage',
  '/dashboard',
  '/api/dashboard',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isManagementPath = BLOCKED_MANAGEMENT_PATHS.some((path) => (
    pathname === path || pathname.startsWith(`${path}/`)
  ));

  if (isManagementPath) {
    return new NextResponse('Not found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/manage/:path*',
    '/api/manage/:path*',
    '/dashboard/:path*',
    '/api/dashboard/:path*',
  ],
};
