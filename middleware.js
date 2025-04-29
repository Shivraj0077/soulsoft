// File: middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Skip middleware for API routes
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Middleware - Path:", path, "Token:", token);

  // Allow unauthenticated users to access sign-in routes
  if (!token) {
    if (path === "/auth/signin" || path.startsWith("/api/auth")) {
      return NextResponse.next();
    }
    console.log("Middleware - Unauthenticated, redirecting to /auth/signin");
    return NextResponse.redirect(
      new URL("/auth/signin?callbackUrl=" + encodeURIComponent(req.nextUrl.pathname), req.url)
    );
  }

  // Handle root path or dashboard
  if (path === "/" || path === "/dashboard") {
    const role = token.role || "candidate";
    console.log("Middleware - Redirecting based on role:", role);
    if (role === "recruiter") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }
  }

  // Protect recruiter routes
  if (path.startsWith("/recruiter") && token.role !== "recruiter") {
    console.log("Middleware - Unauthorized access to recruiter route, redirecting to /candidate/dashboard");
    return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
  }

  // Protect candidate routes
  if (path.startsWith("/candidate") && token.role === "recruiter") {
    console.log("Middleware - Unauthorized access to candidate route, redirecting to /recruiter/dashboard");
    return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/candidate/:path*", "/recruiter/:path*", "/auth/:path*"],
};