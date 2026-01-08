'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { useState, useEffect } from 'react';
import { ApiHttpClientService } from '@/service/api-http-client.service';

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * Initializes auth token from localStorage on app mount.
 * This restores authentication state when using staging API tokens.
 *
 * TODO: Replace with proper token refresh/validation flow
 */
function AuthInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        ApiHttpClientService.setToken(token);
      }
    }
  }, []);

  return null;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthInitializer />
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
