'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JobDetails() {
  const { data: session, status } = useSession();
  const paramsPromise = useParams();
  const router = useRouter();
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = await paramsPromise;
        const id = params.jobId;
        console.log(`Fetching job for jobId: ${id}`);
        setJobId(id);

        if (!id || isNaN(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
          throw new Error('Invalid job ID');
        }

        const jobResponse = await fetch(`/api/jobs/${id}`);
        if (!jobResponse.ok) {
          console.error(`Failed to fetch job: ${jobResponse.status}`);
          throw new Error(`Job not found (Status: ${jobResponse.status})`);
        }
        const jobData = await jobResponse.json();
        console.log('Fetched job:', jobData);

        if (!jobData.job) {
          throw new Error('Job data not found in response');
        }

        setJob({
          ...jobData.job,
          job_id: parseInt(jobData.job.job_id, 10),
        });

        if (status === 'authenticated') {
          const applicationsResponse = await fetch('/api/applications/user');
          if (!applicationsResponse.ok) {
            console.error(`Failed to fetch applications: ${applicationsResponse.status}`);
            throw new Error(`Failed to fetch applications: ${applicationsResponse.status}`);
          }
          const applicationsData = await applicationsResponse.json();
          console.log('Fetched applications:', applicationsData.applications?.map(a => ({
            application_id: a.application_id,
            job_id: a.job_id,
          })));
          const applied = applicationsData.applications.some(app => app.job_id === parseInt(id, 10));
          setHasApplied(applied);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchData();
    } else if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/applicant/jobs/${jobId || ''}`)}`);
    }
  }, [status, paramsPromise, router, jobId]);

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Unknown';
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error || 'Job details not available'}</div>
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

      <div className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Link
            href="/applicant/dashboard"
            className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            <svg
              className="mr-2 h-5 w-5 transform group-hover:-translate-x-1 transition-transform"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl mb-6">
            <div className="px-6 py-8 sm:px-8 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                <p className="mt-2 text-white/80">
                  {job.location || 'Remote'} • {job.employment_type || 'Not specified'}
                </p>
              </div>
              <div>
                {hasApplied ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/20">
                    Already Applied
                  </span>
                ) : (
                  <Link
                    href={`/applicant/jobs/${job.job_id}/apply`}
                    className="inline-flex items-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30"
                  >
                    Apply Now
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl">
            <div className="border-t border-white/10">
              <dl>
                <div className="bg-white/5 px-6 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                  <dt className="text-sm font-medium text-white/80">Description</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                    {job.description || 'No description provided'}
                  </dd>
                </div>
                <div className="bg-white/10 px-6 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                  <dt className="text-sm font-medium text-white/80">Skills Required</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                    {job.skills_required ? (
                      <div className="flex flex-wrap gap-2">
                        {job.skills_required.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/20"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      'Not specified'
                    )}
                  </dd>
                </div>
                <div className="bg-white/5 px-6 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                  <dt className="text-sm font-medium text-white/80">Salary Range</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                    {job.salary_range || 'Competitive'}
                  </dd>
                </div>
                <div className="bg-white/10 px-6 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                  <dt className="text-sm font-medium text-white/80">Employment Type</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                    {job.employment_type || 'Not specified'}
                  </dd>
                </div>
                <div className="bg-white/5 px-6 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                  <dt className="text-sm font-medium text-white/80">Posted Date</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                    {formatDate(job.posted_date)}
                  </dd>
                </div>
                {job.deadline_date && (
                  <div className="bg-white/10 px-6 py-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                    <dt className="text-sm font-medium text-white/80">Application Deadline</dt>
                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                      {formatDate(job.deadline_date)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="bg-white/5 px-6 py-6 sm:px-8 flex justify-end">
              {hasApplied ? (
                <div className="flex items-center">
                  <span className="text-sm text-white/80 mr-4">You've already applied to this job</span>
                  <Link
                    href="/applicant/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out"
                  >
                    View Your Application
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/applicant/jobs/${job.job_id}/apply`}
                  className="inline-flex items-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30"
                >
                  Apply for this Position
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}