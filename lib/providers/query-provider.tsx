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

            // Retry failed requests once
            retry: 1,

            // Don't retry on 4xx errors (client errors)
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