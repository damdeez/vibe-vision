"use client";

import {
  SessionProvider as NextAuthSessionProvider,
  SessionProviderProps as NextAuthSessionProviderProps,
} from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
  session?: NextAuthSessionProviderProps["session"];
}

const SessionProvider = ({ children, session }: SessionProviderProps) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
