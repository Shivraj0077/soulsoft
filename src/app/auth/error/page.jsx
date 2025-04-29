'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">
            An error occurred during sign-in.
          </p>
        </div>
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error === 'OAuthSignin' &&
            'Error starting the sign-in process. Please try again.'}
          {error === 'OAuthCallback' &&
            'Error during the sign-in process. Please try again.'}
          {error === 'Default' && 'An unexpected error occurred. Please try again.'}
          {!error && 'An unknown error occurred. Please try again.'}
        </div>
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}