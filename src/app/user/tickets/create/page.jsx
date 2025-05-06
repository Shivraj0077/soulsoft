'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertTriangle, Upload } from 'lucide-react';

const PRODUCT_OPTIONS = [
  'Shetkari Krushi Software',
  'Shopcare Billing Software',
  'K-Bazaar Billing Software',
  'Pharma-Chemist Vision',
];

const SERVICE_OPTIONS = [
  'Web Design and Development',
  'Digital Marketing',
  'E-commerce',
  'Android App Development',
  'Software Development',
  'Windows Billing Software',
  'Learning Management System',
  'Customer Relationship Management',
];

export default function CreateTicket() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem_type: 'product',
    product_service_name: PRODUCT_OPTIONS[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({
      ...prev,
      problem_type: type,
      product_service_name: type === 'product' ? PRODUCT_OPTIONS[0] : SERVICE_OPTIONS[0],
    }));
  };

  const handleServiceProductChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      product_service_name: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create ticket');
      }

      router.push('/user/tickets');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options = formData.problem_type === 'product' ? PRODUCT_OPTIONS : SERVICE_OPTIONS;

  return (
    <div className="min-h-screen bg-black text-zinc-100 bg-[radial-gradient(ellipse_at_top_right,rgba(30,30,30,0.3),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(30,30,30,0.3),transparent_70%)]">
      <div className="container mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center mb-8"
        >
          <Link
            href="/user/tickets"
            className="flex items-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Tickets
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8"
        >
          Create New Support Ticket
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-zinc-400 font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="Enter ticket title"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-2">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="Describe your issue in detail"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-2">Type</label>
              <select
                name="problem_type"
                value={formData.problem_type}
                onChange={handleTypeChange}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-2">
                {formData.problem_type === 'product' ? 'Product' : 'Service'}
              </label>
              <select
                name="product_service_name"
                value={formData.product_service_name}
                onChange={handleServiceProductChange}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-2">
                Attachment (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-zinc-700 file:text-zinc-100 hover:file:bg-zinc-600"
                />
                <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/user/tickets"
                className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors duration-200"
              >
                Cancel
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-all duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Ticket'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}