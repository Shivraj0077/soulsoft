'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditJob({ params }) {
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    location: '',
    salary_range: '',
    employment_type: '',
    deadline_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { jobId } = params;

  // Fetch job details
  useEffect(() => {
    async function fetchJob() {
      try {
        console.log(`Fetching job with ID: ${jobId}`);
        const res = await fetch(`/api/jobs/${jobId}`);
        console.log(`Fetch response status: ${res.status}`);
        if (res.ok) {
          const data = await res.json();
          console.log('Job data:', data);
          setJob(data);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            skills_required: data.skills_required || '',
            location: data.location || '',
            salary_range: data.salary_range || '',
            employment_type: data.employment_type || '',
            deadline_date: data.deadline_date ? new Date(data.deadline_date).toISOString().split('T')[0] : '',
          });
        } else {
          setError(`Failed to load job: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Error loading job');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchJob();
    } else if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to signin');
      router.push('/auth/signin');
    }
  }, [status, jobId, router]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting updated job:', formData);
      const res = await fetch(`/api/jobs/${jobId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        console.log('Job updated successfully');
        router.push('/recruiter/dashboard');
      } else {
        const errorData = await res.json();
        console.error('Failed to update job:', res.status, errorData);
        setError(`Failed to update job: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Error updating job');
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

  if (!session || status !== 'authenticated') {
    return null; // Middleware should handle redirect
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Edit Job #{jobId}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="skills_required" className="block text-sm font-medium text-black">
              Skills Required
            </label>
            <input
              type="text"
              name="skills_required"
              id="skills_required"
              value={formData.skills_required}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-black">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="salary_range" className="block text-sm font-medium text-black">
              Salary Range
            </label>
            <input
              type="text"
              name="salary_range"
              id="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="employment_type" className="block text-sm font-medium text-black">
              Employment Type
            </label>
            <input
              type="text"
              name="employment_type"
              id="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="deadline_date" className="block text-sm font-medium text-black">
              Deadline Date
            </label>
            <input
              type="date"
              name="deadline_date"
              id="deadline_date"
              value={formData.deadline_date}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
            <Link
              href="/recruiter/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}