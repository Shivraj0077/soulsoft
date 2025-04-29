// File: app/auth/signin/page.js
"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Default to root if no callbackUrl

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to the callbackUrl or let server-side handle it
      router.push(callbackUrl);
    } else if (status === "unauthenticated") {
      // Trigger sign-in, let server-side callbacks handle redirect
      signIn("google", { callbackUrl });
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Signing in...</h1>
        <p className="mt-2 text-gray-600">Redirecting you to Google login.</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}