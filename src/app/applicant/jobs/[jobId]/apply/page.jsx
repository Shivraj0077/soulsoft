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
      <div className="min-h-screen bg-black text-gray-200 antialiased flex items-center justify-center">
        {/* Enhanced animated background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20 max-w-md w-full text-center">
          <svg
            className="mx-auto h-12 w-12 text-white"
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
          <h3 className="mt-4 text-lg font-medium text-white">Application Submitted!</h3>
          <p className="mt-2 text-white/80">
            Your application for "{job.title}" has been submitted successfully.
          </p>
          <div className="mt-6">
            <Link
              href="/applicant/dashboard"
              className="inline-flex items-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
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
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-white mb-6">
            Apply for: {job.title}
          </h2>
          <div className="bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Job Summary</h3>
                <div className="space-y-3">
                  <p className="text-sm text-white/80">
                    <span className="font-medium text-white">Location:</span> {job.location || 'Remote'}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-medium text-white">Salary:</span> {job.salary_range || 'Competitive'}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-medium text-white">Type:</span> {job.employment_type || 'Not specified'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
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
                    className="inline-flex items-center px-6 py-3 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out"
                  >
                    Select File
                  </button>
                  <span className="ml-4 text-sm text-white/80">
                    {resumeFile ? resumeFile.name : 'No file selected'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/60">
                  Accepted formats: PDF, DOC, DOCX. Max size: 5MB.
                </p>
              </div>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-white mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:ring-white/20 sm:text-sm transition-colors duration-200"
                  placeholder="Tell us why you're interested in this position and what makes you a good fit."
                />
              </div>
              {submitError && (
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-white/80"
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
                      <h3 className="text-sm font-medium text-white">Error</h3>
                      <div className="mt-2 text-sm text-white/80">
                        <p>{submitError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <Link
                  href={`/applicant/jobs/${jobId}`}
                  className="inline-flex items-center px-6 py-3 border border-white/20 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
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