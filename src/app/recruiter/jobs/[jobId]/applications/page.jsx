'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getFileProxyUrl, getFileKeyFromUrl } from '@/lib/cloudflare';

export default function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeError, setResumeError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  // Fetch applications for the job
  useEffect(() => {
    async function fetchApplications() {
      try {
        if (!jobId || isNaN(parseInt(jobId, 10))) {
          throw new Error('Invalid job ID');
        }
        console.log(`Fetching applications for jobId: ${jobId}`);
        const res = await fetch(`/api/jobs/${jobId}/applications`);
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched applications:', data);
          setApplications(data.applications || []);
        } else {
          console.error(`Failed to fetch applications: ${res.status}`);
          setError('Failed to load applications');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Error loading applications');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated' && session?.user?.role === 'recruiter') {
      fetchApplications();
    } else if (status === 'authenticated' && session?.user?.role !== 'recruiter') {
      setError('Unauthorized access');
      setLoading(false);
    }
  }, [status, jobId, session]);

  // Update application status
  const updateStatus = async (applicationId, newStatus) => {
    try {
      console.log(`Updating status for application ${applicationId} to ${newStatus}`);
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, application_status: newStatus }
              : app
          )
        );
        console.log(`Status updated for application ${applicationId}`);
      } else {
        const errorData = await res.json();
        console.error(`Failed to update status: ${res.status}`, errorData);
        setError(`Failed to update application status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Error updating application status');
    }
  };

  const ResumeLink = ({ resumeUrl }) => {
    const fileKey = getFileKeyFromUrl(resumeUrl);
    const proxyUrl = getFileProxyUrl(fileKey);

    return (
      <a
        href={proxyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
        onClick={async (e) => {
          e.preventDefault();
          const isAccessible = await testResumeUrl(proxyUrl);
          if (isAccessible) {
            window.open(proxyUrl, '_blank');
          }
        }}
      >
        View Resume
      </a>
    );
  };

  const testResumeUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Resume inaccessible (Status: ${response.status})`);
      }
      setResumeError(null);
      return true;
    } catch (err) {
      console.error('Error accessing resume:', err);
      setResumeError('Unable to access resume file. Please try again later.');
      return false;
    }
  };

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

  if (!session || status !== 'authenticated' || session.user.role !== 'recruiter') {
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
        {resumeError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {resumeError}
          </div>
        )}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {applications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {applications.map((app) => (
                <li key={app.application_id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-black">{app.applicant_name}</h3>
                        <p className="mt-1 text-sm text-black">Email: {app.applicant_email}</p>
                        <p className="mt-1 text-sm text-black">Applied: {new Date(app.applied_date).toLocaleDateString()}</p>
                        {app.cover_letter && (
                          <p className="mt-1 text-sm text-black">
                            Cover Letter: {app.cover_letter.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label htmlFor={`status-${app.application_id}`} className="sr-only">
                            Application Status
                          </label>
                          <select
                            id={`status-${app.application_id}`}
                            value={app.application_status}
                            onChange={(e) => updateStatus(app.application_id, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                        <div>
                          {app.resume_url ? (
                            <ResumeLink resumeUrl={app.resume_url} />
                          ) : (
                            <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 bg-gray-200">
                              No Resume
                            </span>
                          )}
                        </div>
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