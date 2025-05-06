"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Ticket,
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Plus,
  Minus,
  Search,
  Filter,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Sparkles,
} from "lucide-react"
import LogoutButton from "../components/LogoutButton"
import Footer from "../../../components/Footer"

const ADMIN_EMAILS = ["admin1@example.com", "admin2@example.com", "shivrajpawar0077@gmail.com"]

const RECRUITER_EMAILS = ["recruiter1@example.com", "recruiter2@example.com", "shivrajpawar7700@gmail.com"]

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [openFaqId, setOpenFaqId] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const faqs = [
    {
      id: 1,
      question: "How do I create a new support ticket?",
      answer:
        'Sign in to your account and click on the "Create Ticket" button. Fill out the form with details about your issue and submit it.',
    },
    {
      id: 2,
      question: "How long does it take to get a response?",
      answer: "Our team typically responds to new tickets within 24-48 hours on business days.",
    },
    {
      id: 3,
      question: "Can I update my ticket after submission?",
      answer: "Yes, you can add comments or additional information to your existing tickets at any time.",
    },
    {
      id: 4,
      question: "What happens when my ticket is resolved?",
      answer:
        "You'll receive a notification when your ticket is marked as resolved. If you're still experiencing issues, you can reopen the ticket.",
    },
  ]

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true)
        setError(null)

        // For admins, we use a different endpoint to get all company tickets
        const endpoint =
          session?.user?.email && ADMIN_EMAILS.includes(session.user.email) ? "/api/tickets" : "/api/tickets/public"

        console.log(`Fetching tickets from: ${endpoint}`)
        const res = await fetch(endpoint)

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to fetch tickets")
        }

        const data = await res.json()
        console.log("Tickets data received:", data)

        // Ensure we have an array of tickets even if the response format is unexpected
        const ticketsArray = Array.isArray(data) ? data : data.tickets || []

        setTickets(ticketsArray)
      } catch (error) {
        console.error("Error fetching tickets:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch tickets if the user is logged in
    if (status === "authenticated") {
      fetchTickets()
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [status, session])

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email)
  const isRecruiter = session?.user?.email && RECRUITER_EMAILS.includes(session.user.email)

  const filteredTickets = tickets
    .filter((ticket) => {
      if (filter === "all") return true
      return ticket.status === filter
    })
    .filter(
      (ticket) =>
        searchTerm === "" ||
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Using the status color logic from the admin page
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "raised":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "closed":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
      case "in_progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      case "pending":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "resolved":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "raised":
        return <AlertCircle className="w-4 h-4" />
      case "in_progress":
        return <Activity className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-white font-light">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.05),transparent_70%)]">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
              <div className="relative bg-black/40 backdrop-blur-sm p-3 rounded-full border border-blue-500/30">
                <Ticket className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 sm:text-5xl sm:tracking-tight"
          >
            Support Tickets System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 max-w-xl mx-auto text-xl text-blue-100/80"
          >
            {isAdmin
              ? "Admin Dashboard: Monitor and manage all company tickets"
              : "Get help with your issues. Raise a ticket and our support team will assist you."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {!session ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign in to view tickets
                </Link>
              </motion.div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {isAdmin && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/admin/dashboard"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 transition-all duration-300"
                    >
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}
                {isRecruiter && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/recruiter/dashboard"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                    >
                      <User className="mr-2 h-5 w-5" />
                      Recruiter Dashboard
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/tickets/create"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Ticket
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <LogoutButton />
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 backdrop-blur-sm"
            >
              <p className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Error: {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        {session && !loading && filteredTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tickets..."
                className="block w-full pl-10 pr-3 py-2 border border-blue-500/20 rounded-lg bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-blue-500/20 rounded-lg bg-black/40 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Ticket List */}
        {session && !loading && filteredTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-sm border border-blue-500/10 rounded-2xl shadow-lg p-8 mb-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-8 flex items-center">
                <Ticket className="h-6 w-6 mr-3 text-blue-400" />
                Tickets
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-500/10">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Created
                      </th>
                      {isAdmin && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                          User
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-500/10">
                    {filteredTickets.map((ticket, index) => (
                      <motion.tr
                        key={ticket.ticket_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-blue-500/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">#{ticket.ticket_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                          <Link
                            href={`/tickets/${ticket.ticket_id}`}
                            className="hover:text-blue-400 transition-colors flex items-center group"
                          >
                            {ticket.title}
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}
                          >
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">
                              {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1).replace("_", " ")}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                            {ticket.name || ticket.user_name || "Unknown User"}
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* No tickets message */}
        {session && !loading && filteredTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-sm border border-blue-500/10 rounded-2xl shadow-lg p-12 mb-16 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <Ticket className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No tickets found</h3>
            <p className="text-blue-100/60 max-w-md mx-auto mb-6">There are no tickets matching your criteria.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/tickets/create"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Ticket
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-black/40 backdrop-blur-sm border border-blue-500/10 rounded-2xl shadow-lg p-8 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center">
                <HelpCircle className="h-6 w-6 mr-3 text-blue-400" />
                Frequently Asked Questions
              </h2>
              <div className="hidden md:block">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="border border-blue-500/10 rounded-xl overflow-hidden"
                >
                  <motion.button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex justify-center items-center w-full text-center p-5 focus:outline-none bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  >
                    <h3 className="text-lg font-medium text-white flex-grow text-center">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFaqId === faq.id ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"
                    >
                      {openFaqId === faq.id ? (
                        <Minus className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Plus className="h-4 w-4 text-blue-400" />
                      )}
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {openFaqId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-blue-900/5 text-blue-100/80 border-t border-blue-500/10 text-center">
                          <p className="text-xl">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}