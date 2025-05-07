"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  X,
  Plus,
  LogOut,
  Trash2,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  Search,
  ArrowRight,
} from "lucide-react"
import { io } from "socket.io-client"
import { formatSalaryWithRupee } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills_required: "",
    location: "",
    salary_range: "",
    employment_type: "",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session, status } = useSession()
  const router = useRouter()

  // Add new state for applications count
  const [jobApplications, setJobApplications] = useState({})
  const [socket, setSocket] = useState(null)

  // Socket initialization code
  useEffect(() => {
    let socketInstance = null

    const initSocket = async () => {
      try {
        await fetch("/api/socket")
        socketInstance = io(undefined, {
          path: "/api/socket",
          addTrailingSlash: false,
        })

        socketInstance.on("connect", () => {
          console.log("Connected to WebSocket")
          jobs.forEach((job) => {
            socketInstance.emit("join-job", job.job_id)
          })
        })

        socketInstance.on("applicationCountUpdate", ({ jobId, count }) => {
          setJobApplications((prev) => ({
            ...prev,
            [jobId]: count,
          }))
        })

        setSocket(socketInstance)
      } catch (error) {
        console.error("Socket initialization error:", error)
      }
    }

    if (jobs.length > 0) {
      initSocket()
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [jobs])

  // Initial fetch of application counts
  useEffect(() => {
    const fetchInitialCounts = async () => {
      try {
        const counts = await Promise.all(
          jobs.map(async (job) => {
            const res = await fetch(`/api/jobs/${job.job_id}/applications/count`)
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
            const data = await res.json()
            return { jobId: job.job_id, count: data.count }
          }),
        )

        setJobApplications(
          counts.reduce((acc, { jobId, count }) => {
            acc[jobId] = count
            return acc
          }, {}),
        )
      } catch (error) {
        console.error("Error fetching initial counts:", error)
      }
    }

    if (jobs.length > 0) {
      fetchInitialCounts()
    }
  }, [jobs])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/jobs/recruiter", {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
      if (res.ok) {
        const data = await res.json()
        // Ensure job_id is stored as a number consistently
        const jobsData = data.jobs?.map((job) => ({
          ...job,
          job_id: Number.parseInt(job.job_id, 10),
        })) || []
        setJobs(jobsData)
        setFilteredJobs(jobsData)
      } else {
        console.error("Failed to fetch jobs:", res.status)
        setError("Failed to load jobs")
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError("Error loading jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchJobs()
    }
  }, [status, router])

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredJobs(jobs)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = jobs.filter((job) => 
        job.title.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query) || 
        job.location.toLowerCase().includes(query) || 
        job.skills_required.toLowerCase().includes(query) ||
        job.employment_type.toLowerCase().includes(query)
      )
      setFilteredJobs(filtered)
    }
  }, [searchQuery, jobs])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          skills_required: "",
          location: "",
          salary_range: "",
          employment_type: "",
        })
        setIsModalOpen(false)
        await fetchJobs()
        alert("Job created successfully")
      } else {
        const errorData = await res.json()
        console.error("Failed to create job:", res.status, errorData)
        setError(`Failed to create job: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error creating job:", error)
      setError("Error creating job")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    try {
      // Ensure jobId is a number before setting it as deleteLoading state
      const numericJobId = Number.parseInt(jobId, 10)
      setDeleteLoading(numericJobId)
      setError(null)

      if (isNaN(numericJobId) || numericJobId <= 0) {
        console.error(`Invalid job ID ${jobId} passed to handleDelete`)
        setError("Cannot delete job: Invalid job ID")
        setDeleteLoading(null)
        return
      }

      // First check if the job exists
      const checkRes = await fetch(`/api/jobs/${numericJobId}`)
      if (!checkRes.ok) {
        let errorData
        try {
          errorData = await checkRes.json()
        } catch (jsonError) {
          console.error(`Job ID ${numericJobId}: Failed to parse JSON response`, jsonError)
          errorData = { error: `Server error (${checkRes.status})` }
        }
        console.error(`Job ID ${numericJobId} not found or server error:`, errorData)
        setError(`Cannot delete job: ${errorData.error || "Server error"}`)
        setDeleteLoading(null)
        return
      }

      const res = await fetch(`/api/jobs/${numericJobId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await fetchJobs()
        alert("Job deleted successfully")
      } else {
        let errorData
        try {
          errorData = await res.json()
        } catch (jsonError) {
          console.error(`Job ID ${numericJobId}: Failed to parse DELETE response`, jsonError)
          errorData = { error: `Server error (${res.status})` }
        }
        console.error("Failed to delete job:", res.status, errorData)
        setError(`Failed to delete job: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      setError(`Error deleting job: ${error.message || "Unknown error"}`)
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear any local storage or state
      localStorage.removeItem("recruiterSession")
      sessionStorage.clear()

      // Sign out and force a clean redirect
      await signOut({
        callbackUrl: "/auth/signin",
        redirect: true,
      })
    } catch (error) {
      console.error("Error during logout:", error)
      // Fallback redirect
      router.push("/auth/signin")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-white font-light">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-[#1a1a1a] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">My Job Listings</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Post Job</span>
            </motion.button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>
        )}

        {/* Display search results info if searching */}
        {searchQuery.trim() !== "" && (
          <div className="mb-4 text-gray-400">
            {filteredJobs.length === 0 ? (
              <p>No jobs found matching "{searchQuery}"</p>
            ) : (
              <p>Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} matching "{searchQuery}"</p>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.job_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(job.job_id)}
                        disabled={deleteLoading === job.job_id}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        {deleteLoading === job.job_id ? (
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </motion.button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-400">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        <span className="text-sm">{job.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <DollarSign size={16} className="mr-2 text-blue-500" />
                        <span className="text-sm">{formatSalaryWithRupee(job.salary_range)}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Briefcase size={16} className="mr-2 text-blue-500" />
                        <span className="text-sm">{job.employment_type || "Not specified"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                      <div className="flex items-center text-gray-400">
                        <FileText size={16} className="mr-2" />
                        <span className="text-sm">{jobApplications[job.job_id] || 0} applications</span>
                      </div>
                      <Link
                        href={`/recruiter/jobs/${job.job_id}/applications`}
                        className="flex items-center text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight
                          size={16}
                          className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#1a1a1a] rounded-xl bg-[#0a0a0a]"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Briefcase size={24} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No jobs posted yet</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Create your first job posting to start receiving applications from candidates.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Post Your First Job</span>
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Create Job Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
                <h2 className="text-lg font-medium">Create New Job</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Job description and requirements..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="skills_required" className="block text-sm font-medium text-gray-400 mb-1">
                        Skills Required
                      </label>
                      <input
                        type="text"
                        name="skills_required"
                        id="skills_required"
                        value={formData.skills_required}
                        onChange={handleChange}
                        className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="e.g. React, TypeScript"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="e.g. Remote, New York"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="salary_range" className="block text-sm font-medium text-gray-400 mb-1">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        name="salary_range"
                        id="salary_range"
                        value={formData.salary_range}
                        onChange={handleChange}
                        className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="e.g. ₹50,000 - ₹70,000"
                      />
                    </div>
                    <div>
                      <label htmlFor="employment_type" className="block text-sm font-medium text-gray-400 mb-1">
                        Employment Type
                      </label>
                      <select
                        name="employment_type"
                        id="employment_type"
                        value={formData.employment_type}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      >
                        <option value="">Select type</option>
                        <option value="internship">Internship</option>
                        <option value="full-time">Full-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#222] rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      "Create Job"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}