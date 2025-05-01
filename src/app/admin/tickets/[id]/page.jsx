'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

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
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!ticket) {
    return <div className="p-6 text-center">Ticket not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Ticket #{ticket.ticket_id}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mb-6">
        <h2 className="text-xl font-semibold">{ticket.title}</h2>
        <p className="text-gray-600 mt-2">{ticket.description}</p>
        <p className="mt-2">
          <span className="font-medium">Type:</span> {ticket.problem_type}
        </p>
        <p>
          <span className="font-medium">Product/Service:</span> {ticket.product_service_name}
        </p>
        <p>
          <span className="font-medium">Current Status:</span> {ticket.status}
        </p>
        <p>
          <span className="font-medium">Submitted by:</span> {ticket.name} ({ticket.email})
        </p>
        {ticket.image_url && (
          <p>
            <span className="font-medium">Image:</span>{' '}
            <a href={ticket.image_url} target="_blank" className="text-blue-600">
              View Image
            </a>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-lg">
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
            New Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Updating...' : 'Update Ticket'}
        </button>
      </form>
    </div>
  );
}