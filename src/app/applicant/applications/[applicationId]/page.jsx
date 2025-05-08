'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, MapPin, DollarSign, Briefcase, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

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
      // Convert the URL to the correct format if needed
      const correctUrl = url.replace(
        '6d4e4b4efec34acc3857bede42a73f58.r2.cloudflarestorage.com',
        'pub-dce3ac5205e24e14ac4e87998fe0031c.r2.dev'
      );
      
      // Instead of using HEAD request, we'll just check if the URL is properly formatted
      if (!correctUrl.startsWith('https://pub-dce3ac5205e24e14ac4e87998fe0031c.r2.dev/job2/')) {
        throw new Error('Invalid resume URL format');
      }
      
      setResumeError(null);
      return true;
    } catch (err) {
      console.error(`Error with resume URL: ${url}`, err);
      setResumeError(`Unable to access resume. Please contact support if the issue persists.`);
      return false;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl font-semibold text-white/80">Loading...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white/80">{error || 'Application details not available'}</div>
      </div>
    );
  }

  if (!application.job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white/80">Job details not available</div>
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

      <div className="relative z-10 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/applicant/dashboard"
            className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        {resumeError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg text-white/80"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {resumeError}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {application.job?.title || 'Unknown Position'}
            </h2>
            <div className="flex items-center text-white/80">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Status: {application.application_status}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
        >
          <div className="divide-y divide-white/10">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center text-white/80 mb-2">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Job Title</span>
                    </div>
                    <p className="text-white">{application.job?.title || 'Not specified'}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-white/80 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-white">{application.job?.location || 'Remote'}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-white/80 mb-2">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Salary Range</span>
                    </div>
                    <p className="text-white">{application.job?.salary_range || 'Competitive'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center text-white/80 mb-2">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Employment Type</span>
                    </div>
                    <p className="text-white">{application.job?.employment_type || 'Not specified'}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-white/80 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Applied Date</span>
                    </div>
                    <p className="text-white">{formatDate(application.applied_date)}</p>
                  </div>

                  <div>
                    <div className="flex items-center text-white/80 mb-2">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Application Status</span>
                    </div>
                    <p className="text-white">{application.application_status}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center text-white/80 mb-2">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Resume</span>
                  </div>
                  {application.resume_url ? (
                    <a
                      href={application.resume_url.replace(
                        '6d4e4b4efec34acc3857bede42a73f58.r2.cloudflarestorage.com',
                        'pub-dce3ac5205e24e14ac4e87998fe0031c.r2.dev'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        const correctUrl = application.resume_url.replace(
                          '6d4e4b4efec34acc3857bede42a73f58.r2.cloudflarestorage.com',
                          'pub-dce3ac5205e24e14ac4e87998fe0031c.r2.dev'
                        );
                        if (correctUrl.startsWith('https://pub-dce3ac5205e24e14ac4e87998fe0031c.r2.dev/job2/')) {
                          window.open(correctUrl, '_blank');
                        } else {
                          setResumeError('Invalid resume URL format. Please contact support.');
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 ease-in-out"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </a>
                  ) : (
                    <p className="text-white/80">Not provided</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center text-white/80 mb-2">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Cover Letter</span>
                  </div>
                  <p className="text-white/90">{application.cover_letter || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


//https://pub-dce3ac5205e24e14ac4e87998fe0031c.r2.dev/job2/shivrajpawar4426_1746621580144_agasthu4.pdf

//https://6d4e4b4efec34acc3857bede42a73f58.r2.cloudflarestorage.com/job2/shivrajpawar4426_1746621580144_agasthu4.pdf

