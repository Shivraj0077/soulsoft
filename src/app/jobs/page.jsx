'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JobCard } from '@/components/JobCard';
import { motion, AnimatePresence } from 'framer-motion';

const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'recruiter3@example.com',
  'shivrajpawar7700@gmail.com'
];

const ADMIN_EMAILS = [
  'admin1@example.com',
  'admin2@example.com',
  'shivrajpawar0077@gmail.com',
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Remove the redirect effect and only keep the jobs fetch effect
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        } else {
          console.error('Failed to fetch jobs:', res.status);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/jobs');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper function to determine user type
  const getUserType = () => {
    if (!session?.user?.email) return 'guest';
    if (ADMIN_EMAILS.includes(session.user.email)) return 'admin';
    if (RECRUITER_EMAILS.includes(session.user.email)) return 'recruiter';
    return 'applicant';
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-white/80 font-light">Loading jobs...</p>
        </div>
      </div>
    );
  }

  const userType = getUserType();

  return (
    <div className="min-h-screen bg-black text-gray-200 antialiased">
      {/* Enhanced animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent sm:text-5xl sm:tracking-tight"
          >
            Careers at Our Company
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-xl mx-auto text-xl text-white/80"
          >
            Join our team and make an impact. Explore our open positions below.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            {!session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg shadow-white/10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
              >
                Sign in to apply
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                {userType === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg shadow-white/10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userType === 'recruiter' && (
                  <Link
                    href="/recruiter/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg shadow-white/10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                  >
                    Recruiter Dashboard
                  </Link>
                )}
                {userType === 'applicant' && (
                  <Link
                    href="/applicant/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg shadow-white/10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                  >
                    My Applications
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg shadow-white/10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            <AnimatePresence>
              {jobs.map((job, index) => (
                <motion.div
                  key={job.job_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-3 flex flex-col items-center justify-center py-12 px-4 border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg text-white/80">No jobs available at the moment.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}