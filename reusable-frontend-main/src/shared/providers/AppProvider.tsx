"use client";

/**
 * -------------------------------------------------------
 * File: shared/providers/AppProvider.tsx
 * Description:
 * Root application provider.
 * Composes all global providers in a single place.
 * -------------------------------------------------------
 */

import { ReactNode } from "react";

import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import ThemeProvider from "./ThemeProvider";
import { ToastProvider } from "@/shared/components/ui/Toast/toast.store";
import { ToastContainer } from "@/shared/components/ui/Toast/Toast";
import AuthSynchronization from "@/app/AuthSynchronization";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({
  children,
}: AppProviderProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthSynchronization />
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
