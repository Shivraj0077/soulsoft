'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin/tickets');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return null; // Redirects to /admin/tickets
}