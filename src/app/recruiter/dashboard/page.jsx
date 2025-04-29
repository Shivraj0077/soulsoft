// File: app/recruiter/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecruiter, setIsRecruiter] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication and recruiter status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/recruiter/dashboard");
      return;
    }

    if (status === "authenticated") {
      // Check role from session first
      if (session.user.role !== "recruiter") {
        console.log("RecruiterDashboard - User is not a recruiter, redirecting to /jobs");
        router.push("/jobs");
        return;
      }

      async function checkRecruiter() {
        try {
          const res = await fetch("/api/recruiters/check", {
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Failed to check recruiter status");
          }
          const data = await res.json();
          console.log("RecruiterDashboard - Recruiter check:", data);
          if (!data.isRecruiter) {
            console.log("RecruiterDashboard - Unauthorized user, redirecting to /jobs");
            router.push("/jobs");
          } else {
            setIsRecruiter(true);
          }
        } catch (error) {
          console.error("Error checking recruiter status:", error);
          setError("Failed to verify recruiter status. Please try again.");
        }
      }
      checkRecruiter();
    }
  }, [status, session, router]);

  // Fetch all jobs
  useEffect(() => {
    async function fetchJobs() {
      if (status === "authenticated" && isRecruiter) {
        try {
          const res = await fetch("/api/jobs", {
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch jobs");
          }
          const data = await res.json();
          setJobs(data);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setError("Failed to load jobs. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchJobs();
  }, [status, isRecruiter]);

  async function deleteJob(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setJobs(jobs.filter((job) => job.job_id !== jobId));
        } else {
          const errorData = await res.json();
          alert(`Failed to delete: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      }
    }
  }

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

  if (status === "loading" || loading || isRecruiter === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-black">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session || !isRecruiter) {
    return null; // Will redirect via useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-black">{error}</p>
          <button
            onClick={() => router.push("/auth/signin")}
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
          <h1 className="text-3xl font-bold text-black">Recruiter Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/recruiter/jobs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Post New Job
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
          <div className="border-4 border-dashed border-black rounded-lg p-4 bg-white">
            <h2 className="text-xl font-semibold text-black mb-4">Your Job Listings</h2>

            {jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        Job Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        Date Posted
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-black">
                    {jobs.map((job) => (
                      <tr key={job.job_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">{job.title}</div>
                          <div className="text-sm text-black">{job.employment_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {job.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {new Date(job.posted_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/jobs/${job.job_id}`}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            View
                          </Link>
                          <Link
                            href={`/recruiter/jobs/edit/${job.job_id}`}
                            className="text-indigo-600 hover:text-indigo-800 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteJob(job.job_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-black mb-4">No jobs posted yet</p>
                <Link
                  href="/recruiter/jobs/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Post Your First Job
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}