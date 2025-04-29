"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Briefcase, Clock } from "lucide-react";

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Extract unique employment types and locations for filters
  const employmentTypes = ["all", ...new Set(jobs.map(job => job.employment_type))];
  const locations = ["all", ...new Set(jobs.map(job => job.location))];

  useEffect(() => {
    console.log("CandidateDashboard - Session status:", status, "Session:", session);
    if (status === "loading") return;

    if (status === "unauthenticated") {
      console.log("CandidateDashboard - Redirecting to signin");
      router.push("/api/auth/signin");
      return;
    }

    async function fetchData() {
      try {
        // Fetch candidate applications
        const applicationsRes = await fetch("/api/applications");
        if (!applicationsRes.ok) {
          const errorText = await applicationsRes.text();
          throw new Error(`Failed to fetch applications: ${applicationsRes.status} ${errorText}`);
        }
        const applicationsData = await applicationsRes.json();
        console.log("CandidateDashboard - Fetched applications:", applicationsData);
        setApplications(applicationsData.applications || []);

        // Set applied job IDs
        const appliedJobIds = new Set(applicationsData.applications.map(app => app.job_id));
        setAppliedJobs(appliedJobIds);

        // Fetch all jobs
        const jobsRes = await fetch("/api/jobs");
        if (!jobsRes.ok) {
          const errorText = await jobsRes.text();
          throw new Error(`Failed to fetch jobs: ${jobsRes.status} ${errorText}`);
        }
        const jobsData = await jobsRes.json();
        console.log("CandidateDashboard - Fetched jobs:", jobsData);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("CandidateDashboard - Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status, router]);

  // Filter jobs based on search term and filters
  useEffect(() => {
    let result = jobs;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills_required.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply employment type filter
    if (filterType !== "all") {
      result = result.filter(job => job.employment_type === filterType);
    }

    // Apply location filter
    if (filterLocation !== "all") {
      result = result.filter(job => job.location === filterLocation);
    }

    setFilteredJobs(result);
  }, [searchTerm, filterType, filterLocation, jobs]);

  // Filter applications based on status
  const filteredApplications = statusFilter === "all"
    ? applications
    : applications.filter(app => app.application_status === statusFilter);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-black">Loading your dashboard...</p>
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
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchData();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Candidate Dashboard</h1>
          <p className="mt-2 text-lg text-black">
            Welcome back, {session?.user?.name || "Candidate"}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-black mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("applications")}
              className={`${
                activeTab === "applications"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-black hover:text-blue-800 hover:border-black"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              My Applications ({filteredApplications.length})
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`${
                activeTab === "jobs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-black hover:text-blue-800 hover:border-black"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Jobs
            </button>
          </nav>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">My Applications</h2>
              {applications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-black">Filter by:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-black focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md text-black"
                  >
                    <option value="all" className="text-black">All Statuses</option>
                    <option value="Pending" className="text-black">Pending</option>
                    <option value="Reviewing" className="text-black">Reviewing</option>
                    <option value="Accepted" className="text-black">Accepted</option>
                    <option value="Rejected" className="text-black">Rejected</option>
                    <option value="Interview Scheduled" className="text-black">Interview Scheduled</option>
                    <option value="Offer Extended" className="text-black">Offer Extended</option>
                  </select>
                </div>
              )}
            </div>

            {filteredApplications.length > 0 ? (
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-black">
                  {filteredApplications.map((application) => (
                    <li key={application.application_id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-black">
                            <Link
                              href={`/jobs/${application.job_id}`}
                              className="hover:text-blue-600"
                            >
                              {application.job_title}
                            </Link>
                          </h3>
                          <div className="flex items-center mt-1 text-sm text-black">
                            <span>{application.company_name || "Unknown Company"}</span>
                            <span className="mx-2">•</span>
                            <span>{application.location}</span>
                          </div>
                          <p className="text-sm text-black mt-1 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Applied on: {new Date(application.applied_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-black mt-1">
                            <span className="font-semibold">Cover Letter:</span>{" "}
                            {application.cover_letter || "Not provided"}
                          </p>
                          <p className="text-sm text-black mt-1">
                            <span className="font-semibold">Resume:</span>{" "}
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Resume
                            </a>
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              application.application_status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.application_status === "Accepted" ||
                                  application.application_status === "Offer Extended"
                                ? "bg-green-100 text-green-800"
                                : application.application_status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : application.application_status === "Interview Scheduled"
                                ? "bg-purple-100 text-purple-800"
                                : application.application_status === "Reviewing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-black"
                            }`}
                          >
                            {application.application_status.replace(/_/g, " ")}
                          </span>
                          <div className="mt-2 flex space-x-2">
                            <Link
                              href={`/jobs/${application.job_id}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View Job
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="mx-auto h-24 w-24 text-black">
                  <Briefcase className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-black">
                  {statusFilter === "all" ? "No applications yet" : "No applications match this status"}
                </h3>
                <p className="mt-1 text-base text-black">
                  {statusFilter === "all"
                    ? "You haven't applied to any jobs yet."
                    : `No applications with status "${statusFilter.replace(/_/g, " ")}".`}
                </p>
                <div className="mt-6 space-x-4">
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Available Jobs
                  </button>
                  {statusFilter !== "all" && (
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-50"
                    >
                      Clear Status Filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Find Your Next Opportunity</h2>
              {/* Search and Filter */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-black" />
                      </div>
                      <input
                        type="text"
                        className="focus:ring-blue-600 focus:border-blue-600 block w-full pl-10 sm:text-sm border-black rounded-md text-black placeholder-black"
                        placeholder="Search jobs by title, description, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-black focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md text-black"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      {employmentTypes.map((type) => (
                        <option key={type} value={type} className="text-black">
                          {type === "all" ? "All Job Types" : type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-black focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm rounded-md text-black"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    >
                      {locations.map((location) => (
                        <option key={location} value={location} className="text-black">
                          {location === "all" ? "All Locations" : location}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </form>
              </div>
              <p className="text-sm text-black mb-4">
                Showing {filteredJobs.length} jobs
                {searchTerm && <span> matching "{searchTerm}"</span>}
                {filterType !== "all" && <span> of type "{filterType}"</span>}
                {filterLocation !== "all" && <span> in "{filterLocation}"</span>}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="px-6 py-8">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-black">{job.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.employment_type}
                        </span>
                      </div>
                      <p className="mt-2 text-black text-sm">{job.location}</p>
                      <p className="mt-1 text-black text-sm">{job.company_name || "Unknown Company"}</p>
                      <div className="mt-4">
                        <p className="text-black line-clamp-3">{job.description}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-black">
                          <span className="font-semibold">Skills:</span> {job.skills_required}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-black">
                          <span className="font-semibold">Salary:</span> {job.salary_range}
                        </p>
                        <p className="text-sm text-black">
                          Posted: {new Date(job.posted_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-6">
                        {appliedJobs.has(job.job_id) ? (
                          <div className="bg-green-100 text-green-800 p-2 rounded-md text-center">
                            <p className="text-sm font-semibold">Already Applied</p>
                            <Link
                              href="/candidate/dashboard"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Application
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={`/jobs/${job.job_id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-lg text-black">No jobs found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                      setFilterLocation("all");
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}