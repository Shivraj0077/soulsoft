'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatSalaryWithRupee } from '@/lib/utils';

export default function ApplicantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        // Fetch all available jobs
        const jobsResponse = await fetch('/api/jobs');
        if (!jobsResponse.ok) {
          console.error(`Failed to fetch jobs: ${jobsResponse.status}`);
          throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`);
        }
        const jobsData = await jobsResponse.json();
        console.log('Fetched jobs:', jobsData.jobs?.map(j => ({ job_id: j.job_id, title: j.title })));

        // Fetch user's applications
        const applicationsResponse = await fetch('/api/applications/user');
        if (!applicationsResponse.ok) {
          console.error(`Failed to fetch applications: ${applicationsResponse.status}`);
          throw new Error(`Failed to fetch applications: ${applicationsResponse.status}`);
        }
        const applicationsData = await applicationsResponse.json();
        console.log('Fetched applications:', applicationsData.applications?.map(a => ({
          application_id: a.application_id,
          job_id: a.job_id,
          status: a.application_status,
        })));

        setJobs(jobsData.jobs || []);
        setApplications(applicationsData.applications || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error loading data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchData();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Get IDs of jobs the user has already applied to
  const appliedJobIds = applications.map(app => app.job_id);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 antialiased">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-80 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>
  
      <nav className="relative z-10 backdrop-blur-md border-b border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Job Board
                </span>
                <span className="ml-2 text-gray-300">| Applicant Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center">
              {session?.user?.email && (
                <div className="text-sm mr-4 text-gray-400">
                  Signed in as: <span className="font-medium text-gray-200">{session.user.email}</span>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500 transition-all duration-200 ease-in-out shadow-lg shadow-red-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      <main className="relative z-10 max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="px-4 py-4 sm:px-0 mb-6 animate-fade-in">
            <div className="bg-red-900/40 border border-red-800 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          </div>
        )}
  
          {/* Available Jobs Section */}
          <div className="px-4 py-6 sm:px-0 animate-fade-in animation-delay-300">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Available Jobs</h2>
          </div>
  
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <div className="mt-4 text-gray-400">Loading jobs...</div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="bg-gray-900/60 backdrop-blur-sm shadow-xl border border-gray-800 overflow-hidden rounded-xl">
              <ul className="divide-y divide-gray-800">
                {jobs
                  .filter(job => !appliedJobIds.includes(job.job_id))
                  .map(job => (
                    <li key={job.job_id} className="transition-all duration-200 hover:bg-gray-800/50">
                      <div className="px-6 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white">{job.title}</h3>
                          <Link
                            href={`/applicant/jobs/${job.job_id}/apply`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500 transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Apply Now
                          </Link>
                        </div>
                        <div className="mt-3 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-400">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
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
                            <p className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0 sm:ml-6">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {formatSalaryWithRupee(job.salary_range)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
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
                        <div className="mt-3">
                          <Link
                            href={`/applicant/jobs/${job.job_id}`}
                            className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                          >
                            <span>View Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/60 backdrop-blur-sm shadow-xl border border-gray-800 overflow-hidden rounded-xl">
              <svg
                className="mx-auto h-16 w-16 text-gray-700"
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
              <h3 className="mt-4 text-lg font-medium text-white">No jobs available</h3>
              <p className="mt-2 text-gray-400">Check back later for new job postings.</p>
            </div>
          )}
        </div>
        {/* Your Applications Section */}
        <div className="px-4 py-6 sm:px-0 animate-fade-in">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Your Applications</h2>
          </div>
  
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <div className="mt-4 text-gray-400">Loading applications...</div>
            </div>
          ) : applications.length > 0 ? (
            <div className="bg-gray-900/60 backdrop-blur-sm shadow-xl border border-gray-800 overflow-hidden rounded-xl mb-10 transition-all duration-300 hover:shadow-blue-900/10">
              <ul className="divide-y divide-gray-800">
                {applications.map((application) => {
                  const job = jobs.find(j => j.job_id === application.job_id);
                  return job ? (
                    <li key={application.application_id} className="transition-all duration-200 hover:bg-gray-800/50">
                      <div className="px-6 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white">{job.title}</h3>
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              application.application_status === 'Accepted'
                                ? 'bg-green-900/60 text-green-200 border border-green-700'
                                : application.application_status === 'Rejected'
                                ? 'bg-red-900/60 text-red-200 border border-red-700'
                                : application.application_status === 'In Review'
                                ? 'bg-blue-900/60 text-blue-200 border border-blue-700'
                                : 'bg-yellow-900/60 text-yellow-200 border border-yellow-700'
                            }`}
                          >
                            {application.application_status || 'Pending'}
                          </span>
                        </div>
                        <div className="mt-3 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-400">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
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
                            <p className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0 sm:ml-6">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {formatSalaryWithRupee(job.salary_range)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
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
                            <p>Applied: {new Date(application.applied_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Link
                            href={`/applicant/applications/${application.application_id}`}
                            className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <span>View Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/60 backdrop-blur-sm shadow-xl border border-gray-800 overflow-hidden rounded-xl mb-10 transition-all duration-300 hover:shadow-blue-900/10">
              <svg
                className="mx-auto h-16 w-16 text-gray-700"
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
              <h3 className="mt-4 text-lg font-medium text-white">No applications yet</h3>
              <p className="mt-2 text-gray-400">
                Browse available jobs below to start applying.
              </p>
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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}