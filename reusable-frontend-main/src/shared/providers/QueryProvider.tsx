"use client";

/**
 * -------------------------------------------------------
 * File: shared/providers/QueryProvider.tsx
 * Description:
 * Global TanStack Query Provider.
 * -------------------------------------------------------
 */

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { createQueryClient } from "@/shared/config/queryClient";

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({
  children,
}: QueryProviderProps) {
  // Previously this provider imported a module-level `queryClient`
  // singleton created once at import time. Because this module has
  // no "use client" boundary of its own, that singleton was created
  // in the Node.js process during SSR and shared across every
  // concurrent request from every user — a documented TanStack Query
  // + Next.js App Router pitfall that can leak cached data between
  // users. Creating it once per component instance via useState
  // keeps one QueryClient per browser session instead.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}