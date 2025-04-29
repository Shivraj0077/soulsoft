"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns"; // Import date-fns for consistent formatting

export default function JobDetailsPage({ params, initialJob }) {
  const jobId = params?.id;
  const [job, setJob] = useState(initialJob || null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(!initialJob);
  const [error, setError] = useState(initialJob ? null : "Loading...");
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!jobId) {
        setError("Job ID is missing");
        setLoading(false);
        return;
      }

      if (initialJob) {
        setLoading(false);
        return;
      }

      try {
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        if (!jobRes.ok) {
          throw new Error("Job not found");
        }
        const jobData = await jobRes.json();
        setJob(jobData);

        if (status === "authenticated") {
          const appliedRes = await fetch(`/api/applications/check/${jobId}`);
          if (appliedRes.ok) {
            const appliedData = await appliedRes.json();
            setHasApplied(appliedData.hasApplied);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [jobId, status, initialJob]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    if (!jobId || !coverLetter || !resumeFile) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setApplying(true);
      setError(null);

      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("cover_letter", coverLetter);
      formData.append("resume", resumeFile);

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }

      const result = await response.json();
      setHasApplied(true);
      setShowApplyForm(false);
      alert(`Application submitted successfully! Resume URL: ${result.resumeUrl}`);
    } catch (error) {
      console.error("Error applying for job:", error);
      setError(error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
          <p className="mt-4 text-lg text-gray-600">{error || "The job you're looking for doesn't exist or has been removed."}</p>
          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-2 text-gray-600">{job.location}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {job.employment_type}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium">Posted:</span>
                <span className="ml-1">{format(new Date(job.posted_date), "yyyy-MM-dd")}</span>
              </div>
              {job.deadline_date && (
                <div className="flex items-center">
                  <span className="font-medium">Deadline:</span>
                  <span className="ml-1">{format(new Date(job.deadline_date), "yyyy-MM-dd")}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="font-medium">Salary:</span>
                <span className="ml-1">{job.salary_range}</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex_flex-wrap gap-2">
                {job.skills_required.split(",").map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              {!session ? (
                <div className="text-center">
                  <p className="mb-4 text-gray-700">You need to sign in to apply for this job.</p>
                  <Link
                    href="/api/auth/signin"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign In to Apply
                  </Link>
                </div>
              ) : hasApplied ? (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">You have already applied for this job.</p>
                  <Link
                    href="/candidate/dashboard"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    View My Applications
                  </Link>
                </div>
              ) : showApplyForm ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for this Position</h3>
                  <form onSubmit={handleApply}>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
                      <input
                        type="file"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept=".pdf,.doc,.docx"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md"
                        placeholder="Tell us why you're a good fit for this position..."
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        disabled={applying}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={applying}
                      >
                        {applying ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/jobs" className="text-blue-600 hover:text-blue-800">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}