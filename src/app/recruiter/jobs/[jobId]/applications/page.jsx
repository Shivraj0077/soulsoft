"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { getFileProxyUrl, getFileKeyFromUrl } from "@/lib/cloudflare"
import {
  ChevronLeft,
  FileText,
  Mail,
  Calendar,
  User,
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function JobApplications() {
  const [applications, setApplications] = useState([])
  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resumeError, setResumeError] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const jobId = params.jobId

  // Fetch job details
  useEffect(() => {
    async function fetchJobDetails() {
      try {
        if (!jobId || isNaN(parseInt(jobId, 10))) {
          throw new Error("Invalid job ID")
        }
        
        const res = await fetch(`/api/jobs/${jobId}`)
        if (res.ok) {
          const data = await res.json()
          setJobDetails(data.job)
        } else {
          console.error(`Failed to fetch job details: ${res.status}`)
        }
      } catch (err) {
        console.error("Error fetching job details:", err)
      }
    }

    if (status === "authenticated" && session?.user?.role === "recruiter") {
      fetchJobDetails()
    }
  }, [status, jobId, session])

  // Fetch applications for the job
  useEffect(() => {
    async function fetchApplications() {
      try {
        if (!jobId || isNaN(parseInt(jobId, 10))) {
          throw new Error("Invalid job ID")
        }
        console.log(`Fetching applications for jobId: ${jobId}`)
        const res = await fetch(`/api/jobs/${jobId}/applications`)
        if (res.ok) {
          const data = await res.json()
          console.log("Fetched applications:", data)
          setApplications(data.applications || [])
        } else {
          console.error(`Failed to fetch applications: ${res.status}`)
          setError("Failed to load applications")
        }
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError("Error loading applications")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "recruiter") {
      fetchApplications()
    } else if (status === "authenticated" && session?.user?.role !== "recruiter") {
      setError("Unauthorized access")
      setLoading(false)
    }
  }, [status, jobId, session])

  // Update application status
  const updateStatus = async (applicationId, newStatus) => {
    try {
      console.log(`Updating status for application ${applicationId} to ${newStatus}`)
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, application_status: newStatus }
              : app
          )
        )
        console.log(`Status updated for application ${applicationId}`)
      } else {
        const errorData = await res.json()
        console.error(`Failed to update status: ${res.status}`, errorData)
        setError(`Failed to update application status: ${errorData.error || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Error updating status:", err)
      setError("Error updating application status")
    }
  }

  const ResumeLink = ({ resumeUrl }) => {
    const fileKey = getFileKeyFromUrl(resumeUrl)
    const proxyUrl = getFileProxyUrl(fileKey)

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
        onClick={async (e) => {
          e.preventDefault()
          const isAccessible = await testResumeUrl(proxyUrl)
          if (isAccessible) {
            window.open(proxyUrl, "_blank")
          }
        }}
      >
        <FileText size={16} />
        <span>View Resume</span>
        <ExternalLink size={14} />
      </motion.button>
    )
  }

  const testResumeUrl = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) {
        throw new Error(`Resume inaccessible (Status: ${response.status})`)
      }
      setResumeError(null)
      return true
    } catch (err) {
      console.error("Error accessing resume:", err)
      setResumeError("Unable to access resume file. Please try again later.")
      return false
    }
  }

  // Status badge renderer
  const StatusBadge = ({ status }) => {
    let color, icon
    
    switch (status) {
      case "Accepted":
        color = "text-green-500 bg-green-500/10 border-green-500/20"
        icon = <CheckCircle size={16} className="mr-1.5" />
        break
      case "Rejected":
        color = "text-red-500 bg-red-500/10 border-red-500/20"
        icon = <XCircle size={16} className="mr-1.5" />
        break
      default:
        color = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
        icon = <Clock size={16} className="mr-1.5" />
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
        {icon}
        {status}
      </span>
    )
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

  if (!session || status !== "authenticated" || session.user.role !== "recruiter") {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-4">
          <div className="flex items-center">
            <Link 
              href="/recruiter/dashboard" 
              className="flex items-center text-gray-400 hover:text-white mr-4 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Back</span>
            </Link>
            <h1 className="text-lg font-medium">{jobDetails?.title || `Job #${jobId}`} Applications</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-xs font-medium">{session?.user?.name?.[0] || "U"}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center"
              >
                <AlertCircle size={18} className="mr-2" />
                {error}
              </motion.div>
            )}
            
            {resumeError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg flex items-center"
              >
                <AlertCircle size={18} className="mr-2" />
                {resumeError}
              </motion.div>
            )}

            {applications.length > 0 ? (
              <AnimatePresence>
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <motion.div
                      key={app.application_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="bg-[#0c0b0b] border border-[#1a1a1a] rounded-xl overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mr-3">
                                <User size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">{app.applicant_name}</h3>
                                <div className="flex items-center text-gray-400 text-sm">
                                  <Mail size={14} className="mr-1" />
                                  {app.applicant_email}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-gray-400">
                                <Calendar size={16} className="mr-2 text-blue-500" />
                                <span className="text-sm">Applied on {new Date(app.applied_date).toLocaleDateString()}</span>
                              </div>
                              
                              {app.cover_letter && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-300 mb-1">Cover Letter:</h4>
                                  <p className="text-sm text-gray-400 bg-[#111] p-3 rounded-lg max-h-28 overflow-y-auto">
                                    {app.cover_letter}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:items-end space-y-3">
                            <div className="w-full md:w-48">
                              <label htmlFor={`status-${app.application_id}`} className="block text-sm font-medium text-gray-400 mb-1">
                                Status
                              </label>
                              <select
                                id={`status-${app.application_id}`}
                                value={app.application_status}
                                onChange={(e) => updateStatus(app.application_id, e.target.value)}
                                className="w-full bg-[#111] border border-[#222] rounded-lg p-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center">
                              <StatusBadge status={app.application_status} />
                            </div>
                            
                            <div>
                              {app.resume_url ? (
                                <ResumeLink resumeUrl={app.resume_url} />
                              ) : (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-[#1a1a1a] text-gray-400">
                                  <FileText size={16} className="mr-2" />
                                  No Resume
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#1a1a1a] rounded-xl bg-[#0a0a0a]"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <User size={24} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                <p className="text-gray-400 text-center max-w-md mb-6">
                  There are no applications for this job posting yet.
                </p>
                <Link
                  href="/recruiter/dashboard"
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} />
                  <span>Back to Dashboard</span>
                </Link>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}