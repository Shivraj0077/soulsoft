'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TicketForm from '@/app/components/user/TicketForm';

export default function NewTicket() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = () => {
    router.push('/user/tickets');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Ticket</h1>
      <TicketForm onSubmit={handleSubmit} />
    </div>
  );
}