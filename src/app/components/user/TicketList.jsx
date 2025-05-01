'use client';

import Link from 'next/link';

export default function UserTicketList({ tickets }) {
  if (!tickets || tickets.length === 0) {
    return <p className="text-gray-600">No tickets found.</p>;
  }

  return (
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
          <Link href={`/user/tickets/${ticket.ticket_id}`}>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}