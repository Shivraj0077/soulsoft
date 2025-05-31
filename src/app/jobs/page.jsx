'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JobCard } from '@/components/JobCard';
import { motion, AnimatePresence } from 'framer-motion';
import { formatSalaryWithRupee } from '@/lib/utils';

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

      <nav className="relative z-10 backdrop-blur-md border-b border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 py-4 sm:py-0">
            <div className="flex items-center mb-4 sm:mb-0">
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400 animate-gradient">
                  Job Board
                </span>
                <span className="ml-2 text-gray-400">| Available Positions</span>
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {session?.user?.email && (
                <div className="text-sm text-gray-400">
                  Signed in as: <span className="font-medium text-white">{session.user.email}</span>
                </div>
              )}
              {!session ? (
                <Link
                  href="/auth/signin"
                  className="group w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-black/20 hover:shadow-black/40"
                >
                  Sign in to apply
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  {userType === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="group w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-black/20 hover:shadow-black/40"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {userType === 'recruiter' && (
                    <Link
                      href="/recruiter/dashboard"
                      className="group w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-black/20 hover:shadow-black/40"
                    >
                      Recruiter Dashboard
                    </Link>
                  )}
                  {userType === 'applicant' && (
                    <Link
                      href="/applicant/dashboard"
                      className="group w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-black/20 hover:shadow-black/40"
                    >
                      My Applications
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="group w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-black/20 hover:shadow-black/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Available Jobs</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <div className="mt-4 text-gray-400">Loading jobs...</div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <div 
                  key={job.job_id} 
                  className="bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-2xl hover:shadow-white/5 group"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors duration-200">{job.title}</h3>
                      <Link
                        href={`/jobs/${job.job_id}`}
                        className="group/button w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover/button:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        View Details
                      </Link>
                    </div>
                    <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:justify-between">
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                        <p className="flex items-center text-sm text-white/80">
                          <svg
                            className="flex-shrink-0 mr-2 h-5 w-5 text-white/60"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {job.location || 'Remote'}
                        </p>
                        <p className="flex items-center text-sm text-white/80">
                          {formatSalaryWithRupee(job.salary_range)}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-white/80">
                        <svg
                          className="flex-shrink-0 mr-2 h-5 w-5 text-white/60"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p>
                          Posted: {new Date(job.posted_date).toLocaleDateString()}
                          {job.deadline_date &&
                            ` · Due: ${new Date(job.deadline_date).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl">
              <div className="p-4 rounded-full bg-white/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">No jobs available</h3>
              <p className="mt-2 text-white/80">Check back later for new job postings.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add this to the top of your CSS file or within a style tag */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s linear infinite;
        }
      `}</style>
    </div>
  );
}




//remote desktop connection
//iss connection
//