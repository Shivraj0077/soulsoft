"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills_required: "",
    location: "",
    salary_range: "",
    employment_type: "Full-time",
    deadline_date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Check authentication and recruiter status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/recruiter/jobs/create");
    } else if (status === "authenticated") {
      if (!session.user.role.includes("recruiter")) {
        console.log("CreateJobPage - Unauthorized user, redirecting to /jobs");
        router.push("/jobs");
      }
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push("/recruiter/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to create job: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/jobs");
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session || !session.user.role.includes("recruiter")) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-black">{error}</p>
          <button
            onClick={() => router.push("/api/auth/signin")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Signing In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Post a New Job</h1>
          <div className="flex items-center space-x-4">
            <Link 
              href="/recruiter/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-black">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black placeholder-black ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-black">
                    Job Description*
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black placeholder-black ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe the role, responsibilities, requirements, etc."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="skills_required" className="block text-sm font-medium text-black">
                      Required Skills
                    </label>
                    <input
                      type="text"
                      name="skills_required"
                      id="skills_required"
                      value={formData.skills_required}
                      onChange={handleChange}
                      className="mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black placeholder-black"
                      placeholder="e.g. JavaScript, React, Node.js"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-black">
                      Location*
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black placeholder-black ${errors.location ? 'border-red-500' : ''}`}
                      placeholder="e.g. Remote, New York, San Francisco"
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
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
                      className="mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black placeholder-black"
                      placeholder="e.g. $80,000 - $120,000"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="employment_type" className="block text-sm font-medium text-black">
                      Employment Type*
                    </label>
                    <select
                      name="employment_type"
                      id="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black ${errors.employment_type ? 'border-red-500' : ''}`}
                    >
                      <option value="Full-time" className="text-black">Full-time</option>
                      <option value="Part-time" className="text-black">Part-time</option>
                      <option value="Contract" className="text-black">Contract</option>
                      <option value="Internship" className="text-black">Internship</option>
                      <option value="Temporary" className="text-black">Temporary</option>
                    </select>
                    {errors.employment_type && <p className="mt-1 text-sm text-red-600">{errors.employment_type}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="deadline_date" className="block text-sm font-medium text-black">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline_date"
                      id="deadline_date"
                      value={formData.deadline_date}
                      onChange={handleChange}
                      className="mt-1 block w-full border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Link 
                  href="/recruiter/dashboard"
                  className="mr-4 inline-flex items-center px-4 py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}