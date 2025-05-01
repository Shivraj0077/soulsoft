'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const handleSignOut = async () => {
    // Clear any browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Remove all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Sign out with force redirect
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
    >
      Sign Out
    </button>
  );
}