"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "../queries/useCurrentUserQuery";

export interface UseAuthGuardOptions {
  redirectTo?: string;
  roles?: string[];
  forbiddenRedirectTo?: string;
}

/**
 * Client-side UX guard. The backend session is the single source of truth.
 * Redux is only a UI mirror and is deliberately not used to authorize routes.
 */
export const useAuthGuard = ({
  redirectTo = "/login",
  roles,
  forbiddenRedirectTo = "/403",
}: UseAuthGuardOptions = {}) => {
  const router = useRouter();
  const sessionQuery = useCurrentUserQuery();

  const statusCode = (sessionQuery.error as { statusCode?: number } | null)?.statusCode;
  const isAuthFailure = statusCode === 401 || statusCode === 403;
  const isSessionResolved = !sessionQuery.isPending && !sessionQuery.isFetching;
  const isAuthenticated = Boolean(sessionQuery.data);
  const userRole = sessionQuery.data?.role;
  const requiresRole = Boolean(roles?.length);
  const isAuthorized = Boolean(
    isAuthenticated &&
      (!requiresRole || (userRole && roles!.includes(userRole)))
  );

  useEffect(() => {
    if (!isSessionResolved) return;

    if (isAuthFailure || (!sessionQuery.error && !isAuthenticated)) {
      router.replace(redirectTo);
      return;
    }

    if (!sessionQuery.error && requiresRole && !isAuthorized) {
      router.replace(forbiddenRedirectTo);
    }
  }, [
    forbiddenRedirectTo,
    isAuthFailure,
    isAuthenticated,
    isAuthorized,
    isSessionResolved,
    redirectTo,
    requiresRole,
    router,
  ]);

  return {
    isAuthenticated,
    isProtected: true,
    isAuthorized,
    isLoading: !isSessionResolved,
    error: !isAuthFailure ? sessionQuery.error : null,
  };
};

export default useAuthGuard;
