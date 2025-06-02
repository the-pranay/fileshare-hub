'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/app/components/ui/Toast';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
