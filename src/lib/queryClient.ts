/**
 * TanStack Query Client Configuration
 * 
 * Centralized configuration for React Query with optimized defaults:
 * - 5 minute staleTime: Data stays fresh for 5 minutes before refetch
 * - 10 minute gcTime: Inactive queries removed from cache after 10 minutes
 * - 2 retries with exponential backoff for failed requests
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Inactive queries are garbage collected after 10 minutes
            gcTime: 10 * 60 * 1000,

            // Retry failed queries twice
            retry: 2,

            // Exponential backoff with max delay of 30 seconds
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch on window focus for data freshness
            refetchOnWindowFocus: true,

            // Refetch on mount if data is stale
            refetchOnMount: true,

            // Don't refetch on reconnect by default (can override per-query)
            refetchOnReconnect: false,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,

            // Exponential backoff for mutations
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});
