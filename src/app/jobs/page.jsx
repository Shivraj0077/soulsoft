'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JobCard } from '@/components/JobCard';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading jobs...</p>
        </div>
      </div>
    );
  }

  const userType = getUserType();

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight">
            Careers at Our Company
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-300">
            Join our team and make an impact. Explore our open positions below.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {!session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in to apply
              </Link>
            ) : (
              <div className="flex gap-4">
                {userType === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userType === 'recruiter' && (
                  <Link
                    href="/recruiter/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Recruiter Dashboard
                  </Link>
                )}
                {userType === 'applicant' && (
                  <Link
                    href="/applicant/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    My Applications
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-white">No jobs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}