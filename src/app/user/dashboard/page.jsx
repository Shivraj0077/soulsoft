'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);
      const isRecruiter = session?.user?.email && RECRUITER_EMAILS.includes(session.user.email);
      
      if (isAdmin) {
        router.push('/admin/tickets');
      } else if (isRecruiter) {
        router.push('/recruiter/dashboard');
      } else {
        router.push('/user/tickets');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return null;
}