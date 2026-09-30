"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useCurrentUserQuery } from "../queries/useCurrentUserQuery";

interface UseAuthRedirectOptions {
  authenticatedRedirect?: string;
  unauthenticatedRedirect?: string;
}

export const useAuthRedirect = ({
  authenticatedRedirect,
  unauthenticatedRedirect,
}: UseAuthRedirectOptions = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isPending, isFetching } = useCurrentUserQuery();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (isPending || isFetching) return;

    if (
      isAuthenticated &&
      authenticatedRedirect &&
      pathname !== authenticatedRedirect
    ) {
      router.replace(authenticatedRedirect);
      return;
    }

    if (
      !isAuthenticated &&
      unauthenticatedRedirect &&
      pathname !== unauthenticatedRedirect
    ) {
      router.replace(unauthenticatedRedirect);
    }
  }, [
    authenticatedRedirect,
    unauthenticatedRedirect,
    isAuthenticated,
    isPending,
    isFetching,
    pathname,
    router,
  ]);

  return {
    isAuthenticated,
    isPending,
    isFetching,
  };
};

export default useAuthRedirect;