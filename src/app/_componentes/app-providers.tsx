'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { setUser, setToken } from '@/store/auth';
import { useState, useEffect } from 'react';
import { ApiHttpClientService } from '@/service/api-http-client.service';

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * Initializes auth state from localStorage BEFORE rendering.
 * This ensures the token and user are available for all API requests.
 *
 * TODO: Replace with proper token refresh/validation flow
 */
function initializeAuth() {
  if (typeof window !== 'undefined') {
    console.info('[initializeAuth] Restoring auth state from localStorage...');

    // Restore token
    const token = localStorage.getItem('token');
    console.info('[initializeAuth] Token present:', !!token);
    if (token) {
      console.info('[initializeAuth] Token value:', `${token.substring(0, 20)}...`);
      ApiHttpClientService.setToken(token);
      store.dispatch(setToken(token));
      console.info('[initializeAuth] Token restored to Redux and ApiHttpClientService');
    } else {
      console.warn('[initializeAuth] No token found in localStorage');
    }

    // Restore user
    const userStr = localStorage.getItem('user');
    console.info('[initializeAuth] User present:', !!userStr);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        store.dispatch(setUser(user));
        console.info('[initializeAuth] User restored to Redux:', user.email);
      } catch (error) {
        console.error('[initializeAuth] Failed to parse user from localStorage:', error);
      }
    } else {
      console.warn('[initializeAuth] No user found in localStorage');
    }
  } else {
    console.warn('[initializeAuth] Window is undefined (SSR)');
  }
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  // Initialize auth synchronously before creating QueryClient
  const [queryClient] = useState(() => {
    // Restore token from localStorage first
    initializeAuth();

    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 1,
        },
      },
    });
  });

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
