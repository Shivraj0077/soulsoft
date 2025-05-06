'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Loader2 } from 'lucide-react';

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
        router.push('/applicant/dashboard'); // Changed from /user/tickets to /applicant/dashboard
      }
    }
  }, [session, status, router, fromJobsPage, attemptingRecruiterAccess, attemptingAdminAccess, callbackUrl]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('google', {
        callbackUrl: '/auth/signin', // Always redirect back to signin for our custom handling
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
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-80"></div>
      
      {/* Animated glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>

      {/* Card container with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] transition-shadow duration-500"
      >
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.3,
            }}
            className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
          >
            <LogIn className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sign In</h1>
          <p className="mt-2 text-zinc-400">Sign in to access the job board</p>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 text-sm text-red-300 bg-red-900/30 border border-red-800/50 rounded-lg"
            >
              {error === "OAuthSignin" && "Error starting the sign in process. Please try again."}
              {error === "OAuthCallback" && "Error during the sign in process. Please try again."}
              {error === "Default" && "An error occurred. Please try again."}
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign in button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8"
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              y: {
                type: "spring",
                stiffness: 100,
                damping: 15
              }
            }}
            whileHover={{ 
              y: -2,
              transition: {
                duration: 0.2,
                ease: "easeOut"
              }
            }}
            whileTap={{ 
              y: 0,
              transition: {
                duration: 0.1,
                ease: "easeIn"
              }
            }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex justify-center items-center w-full py-2.5 px-4 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5" />
              </motion.div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                <span>Continue with Google</span>
              </div>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
