"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { use } from "react";

export default function JobDetailsPage({ params }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams?.id;
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("JobDetailsPage - Session status:", status, "Session:", session);
    async function fetchData() {
      if (!jobId) {
        setError("Job ID is missing");
        setLoading(false);
        return;
      }

      try {
        // Fetch job details
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        if (!jobRes.ok) {
          const errorText = await jobRes.text();
          throw new Error(`Failed to fetch job: ${jobRes.status} ${jobRes.statusText} - ${errorText}`);
        }
        const jobData = await jobRes.json();
        setJob(jobData);

        // Check if user has applied
        if (status === "authenticated") {
          const appliedRes = await fetch(`/api/applications/check/${jobId}`);
          if (!appliedRes.ok) {
            const errorText = await appliedRes.text();
            throw new Error(`Failed to check application status: ${appliedRes.status} ${appliedRes.statusText} - ${errorText}`);
          }
          const appliedData = await appliedRes.json();
          setHasApplied(appliedData.hasApplied);
        }
      } catch (error) {
        console.error("JobDetailsPage - Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [jobId, status]);

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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      const result = await response.json();
      setHasApplied(true);
      setShowApplyForm(false);
      setResumeFile(null);
      setCoverLetter("");
      alert(`Application submitted successfully! Resume URL: ${result.resumeUrl}`);
    } catch (error) {
      console.error("JobDetailsPage - Error applying for job:", error);
      setError(error.message);
    } finally {
      setApplying(false);
    }
  };

  const retryFetch = async () => {
    setError(null);
    setLoading(true);
    await fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-black">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">Error</h1>
          <p className="mt-4 text-lg text-black">{error}</p>
          <div className="mt-6 space-x-4">
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Jobs
            </Link>
            <button
              onClick={retryFetch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">Job Not Found</h1>
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
        <Link href="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Jobs
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-black">{job.title}</h1>
          <p className="text-black mt-2">{job.company_name || "Unknown Company"}</p>
          <div className="mt-4 space-y-2">
            <p className="text-black">
              <span className="font-semibold">Location:</span> {job.location}
            </p>
            <p className="text-black">
              <span className="font-semibold">Employment Type:</span> {job.employment_type}
            </p>
            <p className="text-black">
              <span className="font-semibold">Salary:</span> {job.salary_range}
            </p>
            <p className="text-black">
              <span className="font-semibold">Skills:</span> {job.skills_required}
            </p>
            <p className="text-black">
              <span className="font-semibold">Posted:</span>{" "}
              {format(new Date(job.posted_date), "yyyy-MM-dd")}
            </p>
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-black">Description</h2>
              <p className="mt-2 text-black whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>
          {status === "authenticated" && hasApplied ? (
            <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-md">
              <p className="font-semibold">Already Applied</p>
              <p>You have already submitted an application for this job.</p>
              <Link
                href="/candidate/dashboard"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                View My Applications
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              {status === "authenticated" && !showApplyForm ? (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply for Job
                </button>
              ) : status === "unauthenticated" ? (
                <Link
                  href="/api/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign In to Apply
                </Link>
              ) : null}
              {showApplyForm && (
                <form onSubmit={handleApply} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-black">
                      Resume
                    </label>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="mt-1 block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-black">
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={5}
                      className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm text-black placeholder-black"
                      placeholder="Enter your cover letter here..."
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={applying}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        applying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyForm(false);
                        setError(null);
                        setResumeFile(null);
                        setCoverLetter("");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}