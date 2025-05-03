'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const path = window.location.pathname;
      await signOut({ redirect: false });
      
      // Determine redirect based on current path
      if (path.startsWith('/user/tickets') || path.startsWith('/admin/tickets')) {
        router.push('/tickets');
      } else if (path.startsWith('/recruiter') || path.startsWith('/applicant')) {
        router.push('/jobs');
      } else {
        // Default redirect for other pages
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"}
    >
      Sign Out
    </button>
  );
}