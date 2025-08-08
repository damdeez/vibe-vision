'use client';

import { SessionProvider as NextAuthSessionProvider, SessionProviderProps as NextAuthSessionProviderProps } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
  session?: NextAuthSessionProviderProps['session'];
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children, session }) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;