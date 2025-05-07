"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LogoutButton from "../components/LogoutButton"
import { motion, AnimatePresence } from "framer-motion"
import {
  HelpCircle,
  LogIn,
  User,
  Shield,
  Briefcase,
  Ticket,
  Sparkles,
  Clock,
  Paperclip,
  CheckCircle,
  FileText,
  Plus,
  Minus,
} from "lucide-react"

const ADMIN_EMAILS = ["admin1@example.com", "admin2@example.com", "shivrajpawar0077@gmail.com"]

const RECRUITER_EMAILS = ["recruiter1@example.com", "recruiter2@example.com", "shivrajpawar7700@gmail.com"]

const faqs = [
  {
    icon: <HelpCircle className="w-5 h-5" />,
    question: "What is a support ticket?",
    answer:
      "A support ticket is a way to track and manage customer issues or requests. When you create a ticket, our support team will review it and provide assistance.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    question: "How long does it take to get a response?",
    answer:
      "We typically respond to tickets within 24-48 hours during business days. Urgent issues are prioritized and may receive faster responses.",
  },
  {
    icon: <Paperclip className="w-5 h-5" />,
    question: "Can I attach files to my ticket?",
    answer:
      "Yes, you can attach relevant files like screenshots, documents, or images to help us better understand your issue. Supported formats include JPG, PNG, PDF, and DOC files.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    question: "How do I check the status of my ticket?",
    answer:
      "You can view all your tickets and their current status in the 'My Tickets' section after logging in. Each ticket shows its status, last update, and any responses from our team.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    question: "What information should I include in my ticket?",
    answer:
      "Please include a clear description of your issue, any relevant error messages, steps to reproduce the problem, and any files that might help us understand the situation better.",
  },
]

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets/public")
        if (res.ok) {
          const data = await res.json()
          setTickets(data.tickets || [])
        }
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email)
  const isRecruiter = session?.user?.email && RECRUITER_EMAILS.includes(session.user.email)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-white font-light">Loading tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.05),transparent_70%)]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
              <div className="relative bg-black/40 backdrop-blur-sm p-3 rounded-full border border-blue-500/30">
                <Ticket className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 sm:text-5xl sm:tracking-tight"
          >
            Support Tickets System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl mx-auto text-xl text-blue-100/80"
          >
            Get help with your issues. Raise a ticket and our support team will assist you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {!session ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <LogIn className="mr-2 h-5 w-5" />
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
                      <Shield className="mr-2 h-5 w-5" />
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
                      <Briefcase className="mr-2 h-5 w-5" />
                      Recruiter Dashboard
                    </Link>
                  </motion.div>
                )}
                {!isAdmin && !isRecruiter && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/user/tickets"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    >
                      <User className="mr-2 h-5 w-5" />
                      My Tickets
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <LogoutButton />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm border border-blue-500/10 rounded-2xl shadow-lg p-8 relative overflow-hidden"
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

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="border border-blue-500/10 rounded-xl overflow-hidden"
                >
                  <motion.button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="flex justify-between items-center w-full text-left p-5 focus:outline-none bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  >
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <span className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 flex-shrink-0 text-blue-400">
                        {faq.icon}
                      </span>
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFaqIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"
                    >
                      {openFaqIndex === index ? (
                        <Minus className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Plus className="h-4 w-4 text-blue-400" />
                      )}
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-blue-900/5 text-blue-100/80 border-t border-blue-500/10">
                          <p>{faq.answer}</p>
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
    </div>
  )
}
