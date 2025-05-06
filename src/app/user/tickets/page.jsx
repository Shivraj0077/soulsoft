'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, AlertCircle, FileText, Clock, Tag, Package, ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import LogoutButton from '@/app/components/LogoutButton';

export default function UserTickets() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle authentication in useEffect
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    } else if (status === 'authenticated') {
      fetchTickets();
    }
  }, [status, router]);

  // Move fetchTickets inside useEffect to avoid premature calls
  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-emerald-950 text-emerald-400 border border-emerald-800"
      case "closed":
        return "bg-zinc-950 text-zinc-400 border border-zinc-800"
      case "in_progress":
        return "bg-amber-950 text-amber-400 border border-amber-800"
      case "pending":
        return "bg-blue-950 text-blue-400 border border-blue-800"
      default:
        return "bg-zinc-950 text-zinc-400 border border-zinc-800"
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Remove the separate session check
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading tickets...</p>
        </div>
      </div>
    );
  }

  // Only render the main content if authenticated
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-black text-zinc-100">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                My Support Tickets
              </h1>
              <p className="mt-2 text-zinc-400">View and manage your support requests</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/user/tickets/create"
                className="inline-flex items-center px-5 py-2.5 rounded-md shadow-lg text-sm font-medium text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Ticket
              </Link>
              <LogoutButton />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-md"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-xl"
            >
              <FileText className="mx-auto h-16 w-16 text-zinc-600" />
              <h3 className="mt-4 text-xl font-medium text-white">No tickets found</h3>
              <p className="mt-2 text-zinc-400">Get started by creating a new support ticket.</p>
              <div className="mt-8">
                <Link
                  href="/user/tickets/create"
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-md text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first ticket
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.ticket_id}
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-white line-clamp-2">{ticket.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="mt-4 text-zinc-400 line-clamp-3">{ticket.description}</p>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center text-sm">
                        <Tag className="h-4 w-4 text-zinc-500 mr-2" />
                        <span className="text-zinc-500">Type:</span>{" "}
                        <span className="ml-1 text-zinc-300">{ticket.problem_type}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 text-zinc-500 mr-2" />
                        <span className="text-zinc-500">Product/Service:</span>{" "}
                        <span className="ml-1 text-zinc-300">{ticket.product_service_name}</span>
                      </div>
                      {ticket.image_url && (
                        <div className="flex items-center text-sm">
                          <ImageIcon className="h-4 w-4 text-zinc-500 mr-2" />
                          <span className="text-zinc-500">Image:</span>{" "}
                          <a
                            href={ticket.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                          >
                            View Attachment
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                      <div className="flex items-center text-sm text-zinc-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {new Date(ticket.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Return null while redirecting
  return null;
}