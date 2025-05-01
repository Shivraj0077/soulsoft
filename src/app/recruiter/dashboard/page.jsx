'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    location: '',
    salary_range: '',
    employment_type: '',
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/jobs/recruiter', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched jobs:', data.jobs.map(job => ({ job_id: job.job_id, title: job.title })));
        // Ensure job_id is stored as a number consistently
        setJobs(data.jobs?.map(job => ({
          ...job,
          job_id: parseInt(job.job_id, 10)
        })) || []);
      } else {
        console.error('Failed to fetch jobs:', res.status);
        setError('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'recruiter') {
      router.push('/applicant/dashboard');
    } else if (status === 'authenticated') {
      fetchJobs(); // Your existing fetchJobs function
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          skills_required: '',
          location: '',
          salary_range: '',
          employment_type: '',
        });
        await fetchJobs();
        alert('Job created successfully');
      } else {
        const errorData = await res.json();
        console.error('Failed to create job:', res.status, errorData);
        setError(`Failed to create job: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Error creating job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      // Ensure jobId is a number before setting it as deleteLoading state
      const numericJobId = parseInt(jobId, 10);
      setDeleteLoading(numericJobId);
      setError(null);
      console.log(`Checking if job ID ${numericJobId} exists before deletion, type = ${typeof numericJobId}`);

      if (isNaN(numericJobId) || numericJobId <= 0) {
        console.error(`Invalid job ID ${jobId} passed to handleDelete`);
        setError('Cannot delete job: Invalid job ID');
        setDeleteLoading(null);
        return;
      }

      // First check if the job exists
      const checkRes = await fetch(`/api/jobs/${numericJobId}`);
      if (!checkRes.ok) {
        let errorData;
        try {
          errorData = await checkRes.json();
        } catch (jsonError) {
          console.error(`Job ID ${numericJobId}: Failed to parse JSON response`, jsonError);
          errorData = { error: `Server error (${checkRes.status})` };
        }
        console.error(`Job ID ${numericJobId} not found or server error:`, errorData);
        setError(`Cannot delete job: ${errorData.error || 'Server error'}`);
        setDeleteLoading(null);
        return;
      }

      console.log(`Sending DELETE request for job ID: ${numericJobId}`);
      const res = await fetch(`/api/jobs/${numericJobId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        console.log(`Job ${numericJobId} deleted successfully`);
        await fetchJobs();
        alert('Job deleted successfully');
      } else {
        let errorData;
        try {
          errorData = await res.json();
        } catch (jsonError) {
          console.error(`Job ID ${numericJobId}: Failed to parse DELETE response`, jsonError);
          errorData = { error: `Server error (${res.status})` };
        }
        console.error('Failed to delete job:', res.status, errorData);
        setError(`Failed to delete job: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setError(`Error deleting job: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear any local storage or state
      localStorage.removeItem('recruiterSession');
      sessionStorage.clear();
      
      // Sign out and force a clean redirect
      await signOut({ 
        callbackUrl: '/auth/signin',
        redirect: true
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback redirect
      router.push('/auth/signin');
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

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Recruiter Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchJobs}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Refreshing...' : 'Refresh Jobs'}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-black mb-4">Create New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                rows={4}
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
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {jobs.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <li key={job.job_id}>
                  <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-black">{job.title}</h3>
                      <p className="mt-1 text-sm text-black">{job.location || 'Remote'}</p>
                      <p className="mt-1 text-sm text-black">
                        <span className="font-semibold">Skills:</span> {job.skills_required || 'Not specified'}
                      </p>
                      <p className="mt-1 text-sm text-black">
                        Posted: {new Date(job.posted_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(job.job_id)}
                        disabled={deleteLoading === job.job_id}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                          deleteLoading === job.job_id ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {deleteLoading === job.job_id ? 'Deleting...' : 'Delete'}
                      </button>
                      <Link
                        href={`/recruiter/jobs/${job.job_id}/applications`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        View Applications
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-lg text-black">No jobs posted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}