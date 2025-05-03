'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, Building } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg text-white">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Job not found</h2>
          <Link
            href="/jobs"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Job header */}
        <div className="bg-zinc-900/90 rounded-xl p-8 backdrop-blur-xl border border-white/10">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-white mb-4">{job.title}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
              {job.employment_type}
            </span>
          </div>

          {/* Job meta information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center text-gray-300">
              <Building className="w-5 h-5 mr-2 text-gray-400" />
              <span>Company Name</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
              <span>{job.salary_range}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 mr-2 text-gray-400" />
              <span>{new Date(job.posted_date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Job description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">{job.description}</p>
            </div>
          </div>

          {/* Required skills */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills_required.split(',').map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300"
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
              className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Sign in to Apply
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}