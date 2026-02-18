import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/session';

export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has(COOKIE_NAME);
  const { pathname } = req.nextUrl;

  if (!hasSession && pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (hasSession && pathname === '/login') {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login'],
};
