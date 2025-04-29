'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ApplicationDetails() {
  const { data: session, status } = useSession();
  const paramsPromise = useParams();
  const router = useRouter();
  const [applicationId, setApplicationId] = useState(null);
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchParamsAndApplication() {
      try {
        const params = await paramsPromise; // Await params to resolve Promise
        const appId = params.applicationId;
        console.log(`Fetching application for applicationId: ${appId}`);
        setApplicationId(appId);

        if (!appId || isNaN(parseInt(appId, 10))) {
          throw new Error('Invalid application ID');
        }

        const response = await fetch(`/api/applications/${appId}`);
        if (!response.ok) {
          console.error(`Failed to fetch application: ${response.status}`);
          throw new Error(`Application not found (Status: ${response.status})`);
        }
        const data = await response.json();
        if (!data.application || !data.job) {
          throw new Error('Invalid application or job data');
        }
        console.log('Fetched application:', {
          application_id: data.application.application_id,
          job_id: data.application.job_id,
          status: data.application.application_status,
          job_title: data.job.title,
        });
        setApplication(data.application);
        setJob(data.job);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err.message || 'Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchParamsAndApplication();
    } else if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/applicant/applications/${applicationId || ''}`)}`);
    }
  }, [status, paramsPromise, router, applicationId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Go back button */}
        <div className="px-4 sm:px-0 mb-4">
          <Link
            href="/applicant/dashboard"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg
              className="mr-1 h-5 w-5"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Application for {job?.title || 'Job'}
          </h2>

          {/* Status Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Application Status
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Applied on {formatDate(application.applied_date)}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    application.application_status
                  )}`}
                >
                  {application.application_status || 'Pending'}
                </span>
                {application.application_status === 'Pending' && (
                  <span className="ml-2 text-sm text-gray-500">
                    Your application is pending review
                  </span>
                )}
                {application.application_status === 'In Review' && (
                  <span className="ml-2 text-sm text-gray-500">
                    Your application is currently being reviewed
                  </span>
                )}
                {application.application_status === 'Accepted' && (
                  <span className="ml-2 text-sm text-gray-500">
                    Congratulations! Your application has been accepted
                  </span>
                )}
                {application.application_status === 'Rejected' && (
                  <span className="ml-2 text-sm text-gray-500">
                    We're sorry, your application was not selected at this time
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Application Details
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {/* Resume */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Resume</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {application.resume_url ? (
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        View Resume
                      </a>
                    ) : (
                      'No resume uploaded'
                    )}
                  </dd>
                </div>
                {/* Cover Letter */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cover Letter</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {application.cover_letter || 'No cover letter provided'}
                  </dd>
                </div>
                {/* Job Title */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {job?.title || 'Unknown'}
                  </dd>
                </div>
                {/* Job Location */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {job?.location || 'Remote'}
                  </dd>
                </div>
                {/* Salary Range */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Salary Range</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {job?.salary_range || 'Competitive'}
                  </dd>
                </div>
                {/* Posted Date */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Posted Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {job?.posted_date ? formatDate(job.posted_date) : 'Unknown'}
                  </dd>
                </div>
                {/* Deadline Date */}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {job?.deadline_date ? formatDate(job.deadline_date) : 'None'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}