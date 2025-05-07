'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAILS = [
  'admin1@example.com',
  'admin2@example.com',
  'shivrajpawar0077@gmail.com',
];

const RECRUITER_EMAILS = [
  'recruiter1@example.com',
  'recruiter2@example.com',
  'shivrajpawar7700@gmail.com',
];

const faqs = [
  {
    question: "What is a support ticket?",
    answer: "A support ticket is a way to track and manage customer issues or requests. When you create a ticket, our support team will review it and provide assistance."
  },
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond to tickets within 24-48 hours during business days. Urgent issues are prioritized and may receive faster responses."
  },
  {
    question: "Can I attach files to my ticket?",
    answer: "Yes, you can attach relevant files like screenshots, documents, or images to help us better understand your issue. Supported formats include JPG, PNG, PDF, and DOC files."
  },
  {
    question: "How do I check the status of my ticket?",
    answer: "You can view all your tickets and their current status in the 'My Tickets' section after logging in. Each ticket shows its status, last update, and any responses from our team."
  },
  {
    question: "What information should I include in my ticket?",
    answer: "Please include a clear description of your issue, any relevant error messages, steps to reproduce the problem, and any files that might help us understand the situation better."
  }
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch('/api/tickets/public');
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets || []);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);
  const isRecruiter = session?.user?.email && RECRUITER_EMAILS.includes(session.user.email);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight"
          >
            Support Tickets System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl mx-auto text-xl text-white"
          >
            Get help with your issues. Raise a ticket and our support team will assist you.
          </motion.p>

          <div className="mt-8 flex justify-center gap-4">
            {!session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Sign in to view tickets
              </Link>
            ) : (
              <div className="flex gap-4">
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-500 hover:bg-slate-600 transition-colors duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {isRecruiter && (
                  <Link
                    href="/recruiter/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    Recruiter Dashboard
                  </Link>
                )}
                {!isAdmin && !isRecruiter && (
                  <Link
                    href="/user/tickets"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    My Tickets
                  </Link>
                )}
                <LogoutButton />
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}