"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditJobPage({ params }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills_required: "",
    location: "",
    salary_range: "",
    employment_type: "",
    deadline_date: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Check authentication and authorization
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/api/auth/signin?callbackUrl=/recruiter/jobs/edit/${id}`);
    } else if (status === "authenticated") {
      const recruiterEmails = ["recruiter1@company.com", "recruiter2@company.com", "shivrajpawar0077@gmail.com"];
      if (!recruiterEmails.includes(session.user.email)) {
        router.push("/jobs");
      } else {
        // Fetch job details
        fetchJob();
      }
    }
  }, [status, session, router, id]);

  async function fetchJob() {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        throw new Error('Job not found');
      }
      const job = await res.json();
      
      // Format date for input element
      let formattedDeadline = "";
      if (job.deadline_date) {
        const deadlineDate = new Date(job.deadline_date);
        formattedDeadline = deadlineDate.toISOString().split('T')[0];
      }
      
      setFormData({
        title: job.title || "",
        description: job.description || "",
        skills_required: job.skills_required || "",
        location: job.location || "",
        salary_range: job.salary_range || "",
        employment_type: job.employment_type || "Full-time",
        deadline_date: formattedDeadline
      });
    } catch (error) {
      console.error("Error fetching job:", error);
      alert("Failed to load job details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim()) newErrors.description = "Job description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.employment_type) newErrors.employment_type = "Employment type is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/recruiter/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to update job: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Job Description*
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="skills_required" className="block text-sm font-medium text-gray-700">
                      Required Skills
                    </label>
                    <input
                      type="text"
                      name="skills_required"
                      id="skills_required"
                      value={formData.skills_required}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location*
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.location ? 'border-red-500' : ''}`}
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salary_range"
                      id="salary_range"
                      value={formData.salary_range}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">
                      Employment Type*
                    </label>
                    <select
                      name="employment_type"
                      id="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.employment_type ? 'border-red-500' : ''}`}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                    {errors.employment_type && <p className="mt-1 text-sm text-red-600">{errors.employment_type}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="deadline_date" className="block text-sm font-medium text-gray-700">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline_date"
                      id="deadline_date"
                      value={formData.deadline_date}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Link 
                  href="/recruiter/dashboard"
                  className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}