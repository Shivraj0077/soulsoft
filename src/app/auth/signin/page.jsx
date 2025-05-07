'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Loader2 } from 'lucide-react';
import Image from 'next/image';

// Define email lists for role checking
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

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const callbackUrl = searchParams.get('callbackUrl');
  const fromJobsPage = callbackUrl?.includes('/jobs');
  const attemptingRecruiterAccess = callbackUrl?.includes('/recruiter');
  const attemptingAdminAccess = callbackUrl?.includes('/admin');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const userEmail = session.user.email;
      const isAdmin = ADMIN_EMAILS.includes(userEmail);
      const isRecruiter = RECRUITER_EMAILS.includes(userEmail);

      // Handle jobs page redirects
      if (fromJobsPage) {
        if (isRecruiter || isAdmin) {
          router.push('/jobs');
        } else {
          router.push('/applicant/dashboard');
        }
        return;
      }

      // Handle tickets page redirects
      if (callbackUrl?.includes('/tickets')) {
        if (isAdmin) {
          router.push('/admin/dashboard');
        } else if (isRecruiter) {
          router.push('/recruiter/dashboard');
        } else {
          router.push('/user/tickets');
        }
        return;
      }

      // Handle direct access attempts to protected routes
      if (attemptingRecruiterAccess) {
        router.push('/jobs');
        return;
      }
      
      if (attemptingAdminAccess) {
        router.push('/user/tickets');
        return;
      }

      // Default redirects when directly accessing signin
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else if (isRecruiter) {
        router.push('/recruiter/dashboard');
      } else {
        router.push('/applicant/dashboard');
      }
    }
  }, [session, status, router, fromJobsPage, attemptingRecruiterAccess, attemptingAdminAccess, callbackUrl]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('google', {
        callbackUrl: '/auth/signin',
        prompt: 'select_account'
      });
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If still checking auth status, show loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-70"></div>
        <Image 
          src="/ppp.jpg" 
          alt="Office workspace with dark aesthetic" 
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Right side - Sign in */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Minimal Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-light text-white mb-2">Welcome back</h1>
            <p className="text-zinc-500 text-sm">Sign in to continue to the platform</p>
          </motion.div>
          
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3 text-xs text-red-300 bg-red-900/20 border border-red-800/30 rounded-md"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign in button - Modern and Minimal */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-zinc-800 rounded-md py-3 px-4 text-white text-sm transition-all duration-200 group"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 mr-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>
          
          {/* Subtle divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-zinc-800"></div>
            <span className="px-3 text-xs text-zinc-600">or</span>
            <div className="flex-grow h-px bg-zinc-800"></div>
          </div>
          
          {/* Secondary sign-in option */}
          
          
          {/* Helper text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-zinc-600"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}