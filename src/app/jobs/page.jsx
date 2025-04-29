'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'recruiter3@example.com',
  'shivrajpawar7700@gmail.com'
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch all jobs
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

  // Redirect authenticated users based on email
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const isRecruiter = RECRUITER_EMAILS.includes(session.user.email);
      const destination = isRecruiter ? '/recruiter/dashboard' : '/applicant/dashboard';
      router.push(destination);
    }
  }, [session, status, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/jobs');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-black">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-black sm:text-5xl sm:tracking-tight">
            Careers at Our Company
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-black">
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
              <>
                <Link
                  href="/applicant/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="px-6 py-8">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-black">{job.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.employment_type || 'Not specified'}
                    </span>
                  </div>
                  <p className="mt-2 text-black text-sm">{job.location || 'Remote'}</p>
                  <div className="mt-4">
                    <p className="text-black line-clamp-3">{job.description}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-black">
                      <span className="font-semibold">Skills:</span>{' '}
                      {job.skills_required || 'Not specified'}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-black">
                      <span className="font-semibold">Salary:</span>{' '}
                      {job.salary_range || 'Competitive'}
                    </p>
                    <p className="text-sm text-black">
                      Posted: {new Date(job.posted_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/applicant/jobs/${job.job_id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-black">No jobs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}