'use client';

import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { formatSalaryWithRupee } from '@/lib/utils';

export function JobCard({ job }) {
  return (
    <div className="group relative">
      {/* Static neon glow effect */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 blur transition duration-300 group-hover:opacity-30" />
      
      {/* Card content */}
      <div className="relative h-full rounded-xl border border-white/10 bg-zinc-900/90 p-6 backdrop-blur-xl transition-all duration-300 group-hover:border-blue-500/50">
        {/* Header with title and type */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
            {job.employment_type || 'Not specified'}
          </span>
        </div>
        
        {/* Essential information */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-lg font-medium">{formatSalaryWithRupee(job.salary_range)}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{new Date(job.posted_date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-6">
          <Link
            href={`/jobs/${job.job_id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-500/50"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}