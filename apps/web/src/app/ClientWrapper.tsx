'use client';

import { ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';
import ModalProvider from '@/components/ModalProvider';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      {children}
      <ModalProvider />
    </UserProvider>
  );
}
