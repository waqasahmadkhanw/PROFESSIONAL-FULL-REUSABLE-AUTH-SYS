"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "../queries/useCurrentUserQuery";
import { getDashboardRedirect } from "../utils/auth.redirect";

export interface UseGuestGuardOptions {
  redirectTo?: string;
}

/** Client-side UX guard for pages intended for signed-out users. */
export const useGuestGuard = ({ redirectTo }: UseGuestGuardOptions = {}) => {
  const router = useRouter();
  const sessionQuery = useCurrentUserQuery();

  const statusCode = (sessionQuery.error as { statusCode?: number } | null)?.statusCode;
  const isResolved = !sessionQuery.isPending && !sessionQuery.isFetching;
  const isAuthenticated = Boolean(sessionQuery.data);
  const role = sessionQuery.data?.role;

  useEffect(() => {
    if (!isResolved || sessionQuery.error || !isAuthenticated || !role) return;
    router.replace(redirectTo ?? getDashboardRedirect(role));
  }, [isAuthenticated, isResolved, redirectTo, role, router]);

  return {
    isGuest: !isAuthenticated,
    isAuthenticated,
    isLoading: !isResolved,
    error: sessionQuery.error,
  };
};

export default useGuestGuard;
