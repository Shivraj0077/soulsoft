'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, Building } from 'lucide-react';
import { formatSalaryWithRupee } from '@/lib/utils';

export default function JobDetailsPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
        } else {
          console.error('Failed to fetch job details:', res.status);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 antialiased">
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <div className="mt-4 text-gray-400">Loading job details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-gray-200 antialiased">
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Job not found</h2>
            <Link
              href="/jobs"
              className="group inline-flex items-center text-white hover:text-white/90 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Jobs
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

      <nav className="relative z-10 backdrop-blur-md border-b border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 py-4 sm:py-0">
            <div className="flex items-center mb-4 sm:mb-0">
              <Link
                href="/jobs"
                className="group inline-flex items-center text-white/80 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Jobs
              </Link>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400 animate-gradient">
                  Job Details
                </span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {/* Job details card */}
          <div className="bg-white/10 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl transition-all duration-200">
            <div className="p-6 sm:p-8">
              {/* Job header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{job.title}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                  {job.employment_type}
                </span>
              </div>

              {/* Job meta information */}
              <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:justify-between">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                  <p className="flex items-center text-sm text-white/80">
                    <Building className="w-5 h-5 mr-2 text-white/60" />
                    Company Name
                  </p>
                  <p className="flex items-center text-sm text-white/80">
                    <MapPin className="w-5 h-5 mr-2 text-white/60" />
                    {job.location || 'Remote'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                  <p className="flex items-center text-sm text-white/80">
                    <Briefcase className="w-5 h-5 mr-2 text-white/60" />
                    {formatSalaryWithRupee(job.salary_range)}
                  </p>
                  <p className="flex items-center text-sm text-white/80">
                    <Calendar className="w-5 h-5 mr-2 text-white/60" />
                    Posted: {new Date(job.posted_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Job description */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80">{job.description}</p>
                </div>
              </div>

              {/* Required skills */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80 border border-white/20"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply button */}
              <div className="mt-8">
                <Link
                  href={`/auth/signin?callbackUrl=/jobs/${params.id}`}
                  className="group/button w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 transition-all duration-200 ease-in-out shadow-lg shadow-white/20 hover:shadow-white/30"
                >
                  Sign in to Apply
                </Link>
              </div>
            </div>
          </div>
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