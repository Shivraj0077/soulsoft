'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JobApplications({ params }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { jobId } = params;

  // Fetch applications for the job
  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/applications`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        } else {
          setError('Failed to load applications');
        }
      } catch (err) {
        setError('Error loading applications');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchApplications();
    }
  }, [status, jobId]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-black">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || status !== 'authenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <Link
            href="/recruiter/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Applications for Job #{jobId}</h1>
          <Link
            href="/recruiter/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {applications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {applications.map((app) => (
                <li key={app.application_id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-black">{app.applicant_name}</h3>
                        <p className="mt-1 text-sm text-black">Email: {app.applicant_email}</p>
                        <p className="mt-1 text-sm text-black">Status: {app.application_status}</p>
                        <p className="mt-1 text-sm text-black">
                          Applied: {new Date(app.applied_date).toLocaleDateString()}
                        </p>
                        {app.cover_letter && (
                          <p className="mt-1 text-sm text-black">
                            Cover Letter: {app.cover_letter.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div>
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-lg text-black">No applications for this job yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}