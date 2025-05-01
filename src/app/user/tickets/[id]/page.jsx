'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

export default function UserTicketDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setUpdates(data.updates);
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
      <h1 className="text-3xl font-bold mb-6">Ticket #{ticket.ticket_id}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold">{ticket.title}</h2>
        <p className="text-gray-600 mt-2">{ticket.description}</p>
        <p className="mt-2">
          <span className="font-medium">Type:</span> {ticket.problem_type}
        </p>
        <p>
          <span className="font-medium">Product/Service:</span> {ticket.product_service_name}
        </p>
        <p>
          <span className="font-medium">Status:</span> {ticket.status}
        </p>
        {ticket.image_url && (
          <p>
            <span className="font-medium">Image:</span>{' '}
            <a href={ticket.image_url} target="_blank" className="text-blue-600">
              View Image
            </a>
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">
          Created: {new Date(ticket.created_at).toLocaleString()}
        </p>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Updates</h3>
      {updates.length === 0 ? (
        <p className="text-gray-600">No updates available.</p>
      ) : (
        <div className="grid gap-4">
          {updates.map((update) => (
            <div key={update.update_id} className="bg-white rounded-lg shadow-md p-4">
              <p>
                <span className="font-medium">Previous Status:</span> {update.previous_status}
              </p>
              <p>
                <span className="font-medium">New Status:</span> {update.new_status}
              </p>
              {update.comment && (
                <p>
                  <span className="font-medium">Comment:</span> {update.comment}
                </p>
              )}
              <p>
                <span className="font-medium">Updated by:</span> {update.updated_by_name}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(update.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}