"use client";

import { useCallback } from "react";

import { useUnlinkGoogleMutation } from "../mutations";
import type { UnlinkGoogleResponse } from "../types";

/**
 * Unlink Google Hook
 *
 * Unlinks the current user's account from Google.
 */
export const useUnlinkGoogle = () => {
  const mutation = useUnlinkGoogleMutation();

  const unlinkGoogle = useCallback(
    async (password?: string) => {
      const response: UnlinkGoogleResponse = await mutation.mutateAsync({ password });
      return response;
    },
    [mutation]
  );

  return {
    unlinkGoogle,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useUnlinkGoogle;
