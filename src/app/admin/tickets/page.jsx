'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  Ticket,
  AlertTriangle,
  Clock,
  User,
  Mail,
  Package2,
  Tag,
  ImageIcon,
  ArrowRight,
  Loader2,
  FileQuestion,
  Search,
} from "lucide-react";
import LogoutButton from '@/app/components/LogoutButton';
import Image from 'next/image';

export default function AdminTickets() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/user/tickets');
      } else {
        fetchTickets();
      }
    }
  }, [status, session, router]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      setTickets(data.tickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tickets) return;
    
    const filtered = tickets.filter((ticket) =>
      Object.values(ticket).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredTickets(filtered);
  }, [searchQuery, tickets]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "closed":
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50"
      case "in_progress":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "pending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50"
    }
  };

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

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 bg-[radial-gradient(ellipse_at_top_right,rgba(30,30,30,0.3),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(30,30,30,0.3),transparent_70%)]">
      <div className="container mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
        >
          <div className="flex items-center">
            <Ticket className="h-8 w-8 mr-3 text-zinc-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">All Support Tickets</h1>
          </div>
          <LogoutButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative flex items-center group">
            {/* Search icon - moved outside of motion.div to ensure it remains visible */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            </div>
            <input
              type="text"
              placeholder="Search tickets by title, status, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl 
                text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all duration-300"
            />
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-8 flex items-center"
          >
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-800/50"
          >
            <FileQuestion className="h-16 w-16 text-zinc-700 mb-4" />
            <p className="text-xl text-zinc-400">
              {searchQuery ? "No matching tickets found." : "No tickets found."}
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.ticket_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 },
                }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
                  borderColor: "rgba(82, 82, 82, 0.5)",
                }}
                className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Ticket Content */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-white">{ticket.title}</h2>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-zinc-400 mt-2 line-clamp-2">{ticket.description}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/admin/tickets/${ticket.ticket_id}`)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full shadow-lg transition-all duration-300 whitespace-nowrap"
                    >
                      Update Ticket
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-zinc-800/50">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-sm">
                        <Tag className="h-4 w-4 text-zinc-500 mr-2" />
                        <span className="text-zinc-500">Type:</span>{" "}
                        <span className="ml-1 text-zinc-300">{ticket.problem_type}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Package2 className="h-4 w-4 text-zinc-500 mr-2" />
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
                            className="ml-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            View Image
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 text-zinc-500 mr-2" />
                        <span className="text-zinc-500">Submitted by:</span>{" "}
                        <span className="ml-1 text-zinc-300">{ticket.name}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-zinc-500 mr-2" />
                        <span className="text-zinc-500">Email:</span>{" "}
                        <span className="ml-1 text-zinc-300">{ticket.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-zinc-500 mr-2 flex-shrink-0" />
                      <span className="text-zinc-500">Created:</span>{" "}
                      <span className="ml-1 text-zinc-300">
                        {new Date(ticket.created_at).toLocaleString()}
                      </span>
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