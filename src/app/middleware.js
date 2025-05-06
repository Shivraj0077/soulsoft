import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Email lists for different roles
const ADMIN_EMAILS = [
  'admin1@example.com',
  'admin2@example.com',
  'shivrajpawar0077@gmail.com',
];

const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'recruiter3@example.com',
  'shivrajpawar7700@gmail.com',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/auth/signin', '/auth/error', '/api/auth'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    // Store previous path when redirecting to signin
    if (pathname === '/auth/signin') {
      const response = NextResponse.next();
      const previousPath = request.headers.get('referer')?.replace(request.nextUrl.origin, '') || '/';
      response.cookies.set('previousPath', previousPath, {
        path: '/',
        maxAge: 60 * 5 // 5 minutes
      });
      return response;
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL('/auth/signin', request.url);
    const response = NextResponse.redirect(url);
    // Store the attempted URL as previous path
    response.cookies.set('previousPath', pathname, {
      path: '/',
      maxAge: 60 * 5 // 5 minutes
    });
    return response;
  }

  const isAdmin = ADMIN_EMAILS.includes(token.email);
  const isRecruiter = RECRUITER_EMAILS.includes(token.email);
  const previousPath = request.cookies.get('previousPath')?.value;

  // Handle redirects based on previous path and role
  if (pathname.startsWith('/auth/signin') && previousPath) {
    if (previousPath.includes('/jobs')) {
      if (!isRecruiter && !isAdmin) {
        return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/jobs', request.url));
    }

    if (previousPath.includes('/tickets')) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (isRecruiter) {
        return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/user/tickets', request.url));
    }
  }

  // Prevent direct access to dashboard pages
  if (pathname.startsWith('/recruiter')) {
    return NextResponse.redirect(new URL('/jobs', request.url));
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/user/tickets', request.url));
  }

  // Allow access to public pages
  if (pathname.startsWith('/jobs') || pathname.startsWith('/user/tickets')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/recruiter/:path*',
    '/applicant/:path*',
    '/user/:path*',
    '/jobs/:path*',
    '/auth/signin',
    '!(api|_next/static|_next/image|favicon.ico)/:path*',
  ]
};