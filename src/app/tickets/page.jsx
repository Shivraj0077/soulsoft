'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Ticket,
  AlertTriangle,
  Clock,
  User,
  Mail,
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Package2,
  Tag,
  FileQuestion,
  Plus,
  Minus
} from "lucide-react";
import LogoutButton from '../components/LogoutButton';
import Footer from '../../../components/Footer';

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

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const faqs = [
    {
      id: 1,
      question: "How do I create a new support ticket?",
      answer: "Sign in to your account and click on the \"Create Ticket\" button. Fill out the form with details about your issue and submit it."
    },
    {
      id: 2,
      question: "How long does it take to get a response?",
      answer: "Our team typically responds to new tickets within 24-48 hours on business days."
    },
    {
      id: 3,
      question: "Can I update my ticket after submission?",
      answer: "Yes, you can add comments or additional information to your existing tickets at any time."
    },
    {
      id: 4,
      question: "What happens when my ticket is resolved?",
      answer: "You'll receive a notification when your ticket is marked as resolved. If you're still experiencing issues, you can reopen the ticket."
    }
  ];

  useEffect(() => {
    async function fetchTickets() {
      try {
        // For admins, we use a different endpoint to get all company tickets
        const endpoint = session?.user?.email && ADMIN_EMAILS.includes(session.user.email) 
          ? '/api/tickets' 
          : '/api/tickets/public';
          
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets || []);
          
          // Calculate stats
          const openTickets = data.tickets.filter(ticket => ticket.status === 'open' || ticket.status === 'raised').length;
          const resolvedTickets = data.tickets.filter(ticket => ticket.status === 'resolved').length;
          const inProgressTickets = data.tickets.filter(ticket => ticket.status === 'in_progress').length;
          
          setStats({
            total: data.tickets.length,
            open: openTickets,
            inProgress: inProgressTickets,
            resolved: resolvedTickets
          });
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch tickets if the user is logged in
    if (status === 'authenticated') {
      fetchTickets();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session]);

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);
  const isRecruiter = session?.user?.email && RECRUITER_EMAILS.includes(session.user.email);

  const filteredTickets = tickets
    .filter(ticket => {
      if (filter === 'all') return true;
      return ticket.status === filter;
    })
    .filter(ticket =>
      searchTerm === '' || 
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Using the status color logic from the admin page
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "raised":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "closed":
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50"
      case "in_progress":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "pending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50"
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open": 
      case "raised": 
        return <AlertCircle className="w-4 h-4" />;
      case "in_progress": return <Activity className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

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
    <div className="min-h-screen bg-black text-zinc-100 bg-[radial-gradient(ellipse_at_top_right,rgba(30,30,30,0.3),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(30,30,30,0.3),transparent_70%)]">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight">
            Support Tickets System
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-white">
            {isAdmin ? 'Admin Dashboard: Monitor and manage all company tickets' : 'Get help with your issues. Raise a ticket and our support team will assist you.'}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {!session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in to view tickets
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-500 hover:bg-slate-600"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {isRecruiter && (
                  <Link
                    href="/recruiter/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Recruiter Dashboard
                  </Link>
                )}
                {!isAdmin && !isRecruiter && (
                  <Link
                    href="/user/tickets"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    My Tickets
                  </Link>
                )}
                <LogoutButton />
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white">Total Tickets</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            <div className="flex justify-center mt-2">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white">Open Tickets</h3>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.open}</p>
            <div className="flex justify-center mt-2">
              <AlertCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white">In Progress</h3>
            <p className="text-3xl font-bold text-amber-400 mt-2">{stats.inProgress}</p>
            <div className="flex justify-center mt-2">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white">Resolved</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">{stats.resolved}</p>
            <div className="flex justify-center mt-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Admin Statistics Section */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg p-6 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Ticket className="h-6 w-6 mr-2 text-zinc-400" />
              Company Ticket Statistics
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400">Ticket Resolution Rate</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.total > 0 
                        ? `${Math.round((stats.resolved / stats.total) * 100)}%` 
                        : '0%'}
                    </h3>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400">In Progress Rate</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.total > 0 
                        ? `${Math.round((stats.inProgress / stats.total) * 100)}%` 
                        : '0%'}
                    </h3>
                  </div>
                  <Activity className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400">Open Ticket Rate</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.total > 0 
                        ? `${Math.round((stats.open / stats.total) * 100)}%` 
                        : '0%'}
                    </h3>
                  </div>
                  <AlertCircle className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg p-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileQuestion className="h-6 w-6 mr-2 text-zinc-400" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-zinc-800/50 last:border-b-0 pb-4 last:pb-0">
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  className="flex justify-between items-center w-full text-left py-3 focus:outline-none group"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{faq.question}</h3>
                  <span className="ml-4 flex-shrink-0">
                    {openFaqId === faq.id ? (
                      <Minus className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Plus className="h-5 w-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    )}
                  </span>
                </button>
                
                {openFaqId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-zinc-400 pl-1"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        
      </div>
      <Footer />
    </div>
  );
}