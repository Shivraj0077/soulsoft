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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeError, setResumeError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = await paramsPromise;
        const id = params.applicationId;
        console.log(`Fetching application for applicationId: ${id}`);
        setApplicationId(id);

        if (!id || isNaN(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
          throw new Error('Invalid application ID');
        }

        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok) {
          console.error(`Failed to fetch application: ${response.status}`);
          throw new Error(`Application not found (Status: ${response.status})`);
        }
        const data = await response.json();
        console.log('Fetched application:', data);

        if (!data.application) {
          throw new Error('Application data not found in response');
        }

        setApplication({
          ...data.application,
          application_id: parseInt(data.application.application_id, 10),
          job_id: parseInt(data.application.job_id, 10),
        });
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err.message || 'Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchData();
      // Poll for status updates every 10 seconds
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    } else if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/applicant/applications/${applicationId || ''}`)}`);
    }
  }, [status, paramsPromise, router, applicationId]);

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Unknown';
  };

  const testResumeUrl = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD', mode: 'cors' });
      if (!res.ok) {
        throw new Error(`Resume inaccessible (Status: ${res.status})`);
      }
      setResumeError(null);
      return true;
    } catch (err) {
      console.error(`Error accessing resume: ${url}`, err);
      setResumeError(`Unable to access resume. Ensure the file is publicly accessible in Cloudflare R2 or contact support.`);
      return false;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error || 'Application details not available'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
          {resumeError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {resumeError}
            </div>
          )}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Application for: {application.job.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Status: {application.application_status}
              </p>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.job.title}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.job.location || 'Remote'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Salary Range</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.job.salary_range || 'Competitive'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.job.employment_type || 'Not specified'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Applied Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(application.applied_date)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Application Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.application_status}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Resume</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.resume_url ? (
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => testResumeUrl(application.resume_url)}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        View Resume
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cover Letter</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {application.cover_letter || 'Not provided'}
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