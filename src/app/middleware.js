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
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('prompt', 'select_account');
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Determine user role
  const isAdmin = ADMIN_EMAILS.includes(token.email);
  const isRecruiter = RECRUITER_EMAILS.includes(token.email);
  const isUser = !isAdmin && !isRecruiter; // Regular ticket system user
  const isApplicant = !isAdmin && !isRecruiter; // Job portal applicant

  // Handle dashboard redirects
  if (pathname === '/dashboard') {
    let destination;
    if (isAdmin) {
      destination = '/admin/tickets';
    } else if (isRecruiter) {
      destination = '/recruiter/dashboard';
    } else if (pathname.startsWith('/user')) {
      destination = '/user/tickets'; // Ticket system users
    } else {
      destination = '/applicant/dashboard'; // Job portal applicants
    }
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Role-based access control
  const isAdminPath = pathname.startsWith('/admin');
  const isUserPath = pathname.startsWith('/user');
  const isRecruiterPath = pathname.startsWith('/recruiter');
  const isApplicantPath = pathname.startsWith('/applicant');

  // Handle ticket system paths
  if (isUserPath && !isUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle admin paths
  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL('/user/tickets', request.url));
  }

  // Handle recruiter paths
  if (isRecruiterPath && !isRecruiter) {
    return NextResponse.redirect(new URL('/user/tickets', request.url));
  }

  // Handle applicant paths
  if (isApplicantPath && !isApplicant) {
    const destination = isAdmin ? '/admin/tickets' : '/recruiter/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/admin/:path*',
    '/user/:path*',
    '/recruiter/:path*',
    '/applicant/:path*',
    '/jobs',
    '!(api/tickets/create)',  
    '/api/tickets/:path*',],
};