'use client';

import { ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';
import ModalProvider from '@/components/ModalProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <UserProvider>
        {children}
        <ModalProvider />
      </UserProvider>
    </ErrorBoundary>
  );
}
