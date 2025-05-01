"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("Thank you for subscribing!")
        setEmail("")
      } else {
        setMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Our{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Mailing List
          </span>
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Receive news and updates directly in your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-6 py-3 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-300 focus:outline-none focus:border-emerald-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 ${message.includes("Thank you") ? "text-emerald-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
        <div className="mt-6">
          <Link
            href="/emails"
            className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 underline"
          >
            View Subscribed Emails
          </Link>
        </div>
      </motion.div>
    </section>
  )
}