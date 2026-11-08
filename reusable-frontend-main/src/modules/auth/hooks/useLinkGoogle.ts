"use client";

import { useCallback } from "react";

import { useLinkGoogleMutation } from "../mutations";
import type { LinkGoogleResponse } from "../types";

/**
 * Link Google Hook
 *
 * Links the current user's account with Google.
 */
export const useLinkGoogle = () => {
  const mutation = useLinkGoogleMutation();

  const linkGoogle = useCallback(
    async (credential: string) => {
      const response: LinkGoogleResponse = await mutation.mutateAsync({ credential });
      return response;
    },
    [mutation]
  );

  return {
    linkGoogle,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useLinkGoogle;
