'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // The middleware should handle redirection, but we add client-side redirection as a fallback
      const isRecruiter = session?.user?.role === 'recruiter';
      const destination = isRecruiter ? '/recruiter/dashboard' : '/applicant/dashboard';
      router.push(destination);
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  // Fallback UI in case redirection doesn't occur
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Redirecting...</h1>
        <p className="mt-2 text-gray-600">
          You are being redirected to your dashboard. If this takes too long, please{' '}
          <a href="/auth/signin" className="text-indigo-600 hover:text-indigo-500">
            sign in again
          </a>
          .
        </p>
      </div>
    </div>
  );
}