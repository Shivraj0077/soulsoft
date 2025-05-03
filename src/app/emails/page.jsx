"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function EmailsPage() {
  const [emails, setEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch("/api/emails")
        const data = await response.json()
        if (response.ok) {
          setEmails(data.emails)
        } else {
          setError(data.error || "Failed to load emails")
        }
      } catch (err) {
        setError("An error occurred while fetching emails")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Subscribed{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Emails
          </span>
        </h1>

        {isLoading && <p className="text-gray-300 text-center">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {!isLoading && !error && emails.length === 0 && (
          <p className="text-gray-300 text-center">No emails subscribed yet.</p>
        )}
        {!isLoading && !error && emails.length > 0 && (
          <ul className="space-y-4">
            {emails.map((email, index) => (
              <li
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 text-gray-300"
              >
                {email}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 underline"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}