import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of recruiter emails
const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'recruiter3@example.com',
  'shivrajpawar7700@gmail.com',
  // Add more recruiter emails as needed
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/auth/signin', '/auth/error', '/api/auth'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Redirect from /dashboard based on email
  if (pathname === '/dashboard') {
    const destination = RECRUITER_EMAILS.includes(token.email)
      ? '/recruiter/dashboard'
      : '/applicant/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Role-based access control
  const isRecruiterPath = pathname.startsWith('/recruiter');
  const isApplicantPath = pathname.startsWith('/applicant');
  const isRecruiter = RECRUITER_EMAILS.includes(token.email);

  if (isRecruiterPath && !isRecruiter) {
    return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
  }

  if (isApplicantPath && isRecruiter) {
    return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/recruiter/:path*',
    '/applicant/:path*',
    '/jobs',
  ],
};