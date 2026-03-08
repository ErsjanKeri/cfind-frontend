'use client';

/**
 * React Query Provider
 *
 * Wraps the application to enable React Query data fetching
 *
 * Features:
 * - Automatic caching
 * - Background refetching
 * - Optimistic updates
 * - Loading/error states
 * - DevTools in development
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Queries are considered fresh for 1 minute
            staleTime: 60 * 1000,

            // Don't refetch on window focus (can be annoying during development)
            refetchOnWindowFocus: false,

            // Retry once, but only for network/server errors (not 4xx client errors)
            retry: (failureCount, error) => {
              if (failureCount >= 1) return false;
              const status = (error as { response?: { status?: number } })?.response?.status;
              if (status && status >= 400 && status < 500) return false;
              return true;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Don't retry mutations by default
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}