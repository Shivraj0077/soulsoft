'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Tag,
  Package2,
  User,
  Mail,
  ImageIcon,
  Clock
} from 'lucide-react';

export default function UpdateTicket() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    comment: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (status === 'authenticated') {
      fetchTicket();
    }
  }, [status, router]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }
      const data = await response.json();
      setTicket(data.ticket);
      setFormData({ status: data.ticket.status, comment: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ticket');
      }

      setSuccess('Ticket updated successfully');
      setTimeout(() => router.push('/admin/tickets'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-zinc-500 animate-spin mb-4" />
        <p className="text-zinc-500 animate-pulse">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-zinc-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 bg-[radial-gradient(ellipse_at_top_right,rgba(30,30,30,0.3),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(30,30,30,0.3),transparent_70%)]">
      <div className="container mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={() => router.push('/admin/tickets')}
            className="flex items-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Tickets
          </button>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8"
        >
          Update Ticket #{ticket.ticket_id}
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-8 flex items-center"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-8 flex items-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">{ticket.title}</h2>
            <p className="text-zinc-400 mb-6">{ticket.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Tag className="h-4 w-4 text-zinc-500 mr-2" />
                <span className="text-zinc-500">Type:</span>
                <span className="ml-2 text-zinc-300">{ticket.problem_type}</span>
              </div>

              <div className="flex items-center text-sm">
                <Package2 className="h-4 w-4 text-zinc-500 mr-2" />
                <span className="text-zinc-500">Product/Service:</span>
                <span className="ml-2 text-zinc-300">{ticket.product_service_name}</span>
              </div>

              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-zinc-500 mr-2" />
                <span className="text-zinc-500">Submitted by:</span>
                <span className="ml-2 text-zinc-300">{ticket.name}</span>
              </div>

              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-zinc-500 mr-2" />
                <span className="text-zinc-500">Email:</span>
                <span className="ml-2 text-zinc-300">{ticket.email}</span>
              </div>

              {ticket.image_url && (
                <div className="flex items-center text-sm">
                  <ImageIcon className="h-4 w-4 text-zinc-500 mr-2" />
                  <span className="text-zinc-500">Image:</span>
                  <a
                    href={ticket.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Image
                  </a>
                </div>
              )}

              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-zinc-500 mr-2" />
                <span className="text-zinc-500">Created:</span>
                <span className="ml-2 text-zinc-300">
                  {new Date(ticket.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
              <div className="mb-6">
                <label htmlFor="status" className="block text-zinc-400 font-medium mb-2">
                  Update Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-600"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="block text-zinc-400 font-medium mb-2">
                  Add Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter your comment here..."
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-all duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Ticket'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}