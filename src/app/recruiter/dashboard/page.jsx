'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { io } from 'socket.io-client';
import { formatSalaryWithRupee } from '@/lib/utils';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Add new state for applications count
  const [jobApplications, setJobApplications] = useState({});
  const [socket, setSocket] = useState(null);

  // Replace the existing socket initialization code
  useEffect(() => {
    let socketInstance = null;

    const initSocket = async () => {
      try {
        await fetch('/api/socket');
        socketInstance = io(undefined, {
          path: '/api/socket',
          addTrailingSlash: false
        });

        socketInstance.on('connect', () => {
          console.log('Connected to WebSocket');
          jobs.forEach(job => {
            socketInstance.emit('join-job', job.job_id);
          });
        });

        socketInstance.on('applicationCountUpdate', ({ jobId, count }) => {
          setJobApplications(prev => ({
            ...prev,
            [jobId]: count
          }));
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    if (jobs.length > 0) {
      initSocket();
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [jobs]);

  // Initial fetch of application counts
  useEffect(() => {
    const fetchInitialCounts = async () => {
      try {
        const counts = await Promise.all(
          jobs.map(async (job) => {
            const res = await fetch(`/api/jobs/${job.job_id}/applications/count`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            return { jobId: job.job_id, count: data.count };
          })
        );

        setJobApplications(
          counts.reduce((acc, { jobId, count }) => {
            acc[jobId] = count;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching initial counts:', error);
      }
    };

    if (jobs.length > 0) {
      fetchInitialCounts();
    }
  }, [jobs]);

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
    } else if (status === 'authenticated') {
      fetchJobs();
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/jobs', {
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
        setIsModalOpen(false);
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

  // Add this function for fetching application counts
  const fetchApplicationsCount = useCallback(async (jobId) => {
    if (!jobId) return;
    
    try {
      const response = await fetch(`/api/jobs/${jobId}/applications/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.success) {
        setJobApplications(prev => ({
          ...prev,
          [jobId]: data.count
        }));
      }
    } catch (error) {
      console.error(`Error fetching applications count for job ${jobId}:`, error);
    }
  }, []);
  
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
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Post New Job
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

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.job_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-black">{job.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(job.job_id)}
                    disabled={deleteLoading === job.job_id}
                    className="text-red-600 hover:text-red-800"
                  >
                    {deleteLoading === job.job_id ? '...' : '×'}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">📍 {job.location || 'Remote'}</p>
                <p className="text-sm text-gray-600">💰 {formatSalaryWithRupee(job.salary_range)}</p>
                <p className="text-sm text-gray-600">
                  🛠️ {job.skills_required || 'No specific skills mentioned'}
                </p>
                <p className="text-sm text-gray-600">
                  📅 Posted: {new Date(job.posted_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  📝 Applications: {jobApplications[job.job_id] || 0}
                </p>
              </div>

              <div className="mt-4">
                <Link
                  href={`/recruiter/jobs/${job.job_id}/applications`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Applications {jobApplications[job.job_id] > 0 && `(${jobApplications[job.job_id]})`} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Create Job Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-black mb-6">Create New Job</h2>
              
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
                  <select
                    name="employment_type"
                    id="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                  >
                    <option value="">Select type</option>
                    <option value="internship">Internship</option>
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
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
          </div>
        )}

        {/* Empty state */}
        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No jobs posted yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Post Your First Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}