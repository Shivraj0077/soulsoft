'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * NextAuth session provider wrapper
 */
export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}