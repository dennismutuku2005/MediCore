import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleRoutes: Record<string, string> = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse',
  patient: '/patient',
  labtech: '/labtech',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and api routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Note: middleware can't access localStorage (server-side)
  // Route protection is handled client-side in role layouts
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
