'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * AuthProvider component that wraps the application with SessionProvider from NextAuth.
 * This must be a client component since SessionProvider uses context.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
