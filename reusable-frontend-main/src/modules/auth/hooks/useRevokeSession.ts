"use client";

import { useCallback } from "react";

import { useRevokeSessionMutation } from "../mutations";
import type { RevokeSessionResponse } from "../types";

/**
 * Revoke Session Hook
 *
 * Revokes a specific session by ID.
 */
export const useRevokeSession = () => {
  const mutation = useRevokeSessionMutation();

  const revokeSession = useCallback(
    async (sessionId: string) => {
      const response: RevokeSessionResponse = await mutation.mutateAsync({ sessionId });
      return response;
    },
    [mutation]
  );

  return {
    revokeSession,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useRevokeSession;
