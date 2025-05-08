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
                <span className="ml-2 text-gray-400">| Applicant Dashboard</span>
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {session?.user?.email && (
                <div className="text-sm text-gray-400">
                  Signed in as: <span className="font-medium text-white">{session.user.email}</span>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="group w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-black/20 hover:shadow-black/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg backdrop-blur-sm shadow-lg shadow-black/20">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-white/60 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            </div>
          </div>
        )}
  
        {/* Available Jobs Section */}
        <div className="animate-fade-in animation-delay-300">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Available Jobs</h2>
          </div>
  
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <div className="mt-4 text-gray-400">Loading jobs...</div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {jobs
                .filter(job => !appliedJobIds.includes(job.job_id))
                .map(job => (
                  <div 
                    key={job.job_id} 
                    className="bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/15 hover:shadow-2xl hover:shadow-white/5 group"
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors duration-200">{job.title}</h3>
                        <Link
                          href={`/applicant/jobs/${job.job_id}/apply`}
                          className="group/button w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover/button:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Apply Now
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
                      <div className="mt-6">
                        <Link
                          href={`/applicant/jobs/${job.job_id}`}
                          className="inline-flex items-center text-sm font-medium text-white hover:text-white/90 transition-colors duration-200 group/link"
                        >
                          <span>View Details</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
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

        {/* Your Applications Section */}
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Your Applications</h2>
          </div>
  
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <div className="mt-4 text-gray-400">Loading applications...</div>
            </div>
          ) : applications.length > 0 ? (
            <div className="bg-white/5 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden rounded-xl mb-10 transition-all duration-300 hover:shadow-black/20">
              <ul className="divide-y divide-white/10">
                {applications.map((application) => {
                  const job = jobs.find(j => j.job_id === application.job_id);
                  return job ? (
                    <li key={application.application_id} className="transition-all duration-200 hover:bg-white/5 group">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <h3 className="text-lg font-medium text-white group-hover:text-gray-300 transition-colors duration-200">{job.title}</h3>
                          <span
                            className={`w-full sm:w-auto inline-flex justify-center px-3 py-1 text-xs leading-5 font-semibold rounded-full ${
                              application.application_status === 'Accepted'
                                ? 'bg-white/10 text-white border border-white/20'
                                : application.application_status === 'Rejected'
                                ? 'bg-white/5 text-white/80 border border-white/10'
                                : application.application_status === 'In Review'
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'bg-white/5 text-white/80 border border-white/10'
                            }`}
                          >
                            {application.application_status || 'Pending'}
                          </span>
                        </div>
                        <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:justify-between">
                          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
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
                            <p className="flex items-center text-sm text-gray-400">
                              
                              {formatSalaryWithRupee(job.salary_range)}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
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
                        <div className="mt-4">
                          <Link
                            href={`/applicant/applications/${application.application_id}`}
                            className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group/link"
                          >
                            <span>View Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="text-center py-12 bg-white/5 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden rounded-xl mb-10 transition-all duration-300 hover:shadow-black/20">
              <div className="p-4 rounded-full bg-white/5 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-white/40"
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