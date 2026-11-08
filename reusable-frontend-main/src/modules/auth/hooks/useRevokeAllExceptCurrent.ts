"use client";

import { useCallback } from "react";

import { useRevokeAllExceptCurrentMutation } from "../mutations";
import type { RevokeAllExceptCurrentResponse } from "../types";

/**
 * Revoke All Except Current Hook
 *
 * Revokes all sessions except the current one.
 */
export const useRevokeAllExceptCurrent = () => {
  const mutation = useRevokeAllExceptCurrentMutation();

  const revokeAllExceptCurrent = useCallback(
    async (password?: string) => {
      const response: RevokeAllExceptCurrentResponse = await mutation.mutateAsync({ password });
      return response;
    },
    [mutation]
  );

  return {
    revokeAllExceptCurrent,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useRevokeAllExceptCurrent;
