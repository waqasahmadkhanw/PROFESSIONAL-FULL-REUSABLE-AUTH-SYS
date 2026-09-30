/**
 * -------------------------------------------------------
 * File: shared/config/queryClient.ts
 * Description:
 * Global TanStack Query configuration.
 *
 * Exposed as a factory (createQueryClient) rather than a
 * module-level singleton. A singleton created here would be
 * instantiated once in the Node.js process during SSR and then
 * shared across every concurrent request from every user — see
 * the comment in shared/providers/QueryProvider.tsx, which calls
 * this once per component instance via useState instead.
 * -------------------------------------------------------
 */

import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/apiError";

const shouldRetry = (failureCount: number, error: unknown) => {
  if (failureCount >= 2) return false;
  if (error instanceof ApiError) return error.statusCode >= 500;
  return true;
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Data freshness
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes

        // Network behavior
        retry: shouldRetry,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,

        // UX
        networkMode: "online",
      },

      mutations: {
        retry: 0,
        networkMode: "online",
      },
    },
  });

export default createQueryClient;