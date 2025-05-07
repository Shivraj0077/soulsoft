'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

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
  const [loading, setLoading] = useState(true);
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
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight">
            Support Tickets System
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-white">
            Get help with your issues. Raise a ticket and our support team will assist you.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {!session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in to view tickets
              </Link>
            ) : (
              <div className="flex gap-4">
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-500 hover:bg-white-700"
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
        </div>
      </div>
    </div>
  );
}