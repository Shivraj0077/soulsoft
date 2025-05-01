'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/components/shared/LogoutButton';

export default function AdminTickets() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
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

  if (status === 'loading') {
    return <div className="p-6">Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Support Tickets</h1>
        <LogoutButton />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <p className="text-gray-600">No tickets found.</p>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.ticket_id} className="bg-white rounded-lg shadow-md p-6">
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
              <p className="text-sm text-gray-500 mt-4">
                Created: {new Date(ticket.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => router.push(`/admin/tickets/${ticket.ticket_id}`)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Update Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}