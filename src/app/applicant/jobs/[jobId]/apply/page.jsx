'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function JobApply() {
  const { data: session, status } = useSession();
  const paramsPromise = useParams();
  const router = useRouter();
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const params = await paramsPromise;
        const id = params.jobId;
        console.log(`Fetching job for jobId: ${id}`);
        setJobId(id);

        if (!id || isNaN(parseInt(id, 10)) || parseInt(id, 10) <= 0) {
          throw new Error('Invalid job ID');
        }

        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          console.error(`Failed to fetch job: ${response.status}`);
          throw new Error(`Job not found (Status: ${response.status})`);
        }
        const data = await response.json();
        console.log('Fetched job:', data);

        if (!data.job) {
          throw new Error('Job data not found in response');
        }

        setJob({
          ...data.job,
          job_id: parseInt(data.job.job_id, 10),
        });
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchJob();
    } else if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/applicant/jobs/${jobId || ''}/apply`)}`);
    }
  }, [status, paramsPromise, router, jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!resumeFile) {
      setSubmitError('Please upload your resume');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', resumeFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!uploadResponse.ok) {
        console.error(`Failed to upload resume: ${uploadResponse.status}`);
        throw new Error('Failed to upload resume');
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload response:', uploadData);

      if (!uploadData.success || !uploadData.url) {
        throw new Error('Invalid upload response');
      }

      const resumeUrl = uploadData.url;
      console.log(`Resume uploaded: ${resumeUrl}`);

      const applicationResponse = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: parseInt(jobId, 10),
          resume_url: resumeUrl,
          cover_letter: formData.coverLetter,
        }),
      });

     /* if (!applicationResponse.ok) {
        console.error(`Failed to submit application: ${applicationResponse.status}`);
        const errorData = await applicationResponse.json();
        throw new Error(errorData.error || 'Failed to submit application');
      } */

      console.log('Application submitted successfully');
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/applicant/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitError(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
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

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Application Submitted!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your application for "{job.title}" has been submitted successfully.
          </p>
          <div className="mt-4">
            <Link
              href="/applicant/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Apply for: {job.title}
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Job Summary</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Location:</span> {job.location || 'Remote'}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Salary:</span> {job.salary_range || 'Competitive'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Type:</span> {job.employment_type || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume / CV *
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Select File
                  </button>
                  <span className="ml-3 text-sm text-gray-500">
                    {resumeFile ? resumeFile.name : 'No file selected'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Accepted formats: PDF, DOC, DOCX. Max size: 5MB.
                </p>
              </div>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Tell us why you're interested in this position and what makes you a good fit."
                />
              </div>
              {submitError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{submitError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Link
                  href={`/applicant/jobs/${jobId}`}
                  className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}