"use client";

import { useCallback } from "react";

import { useActiveSessionsMutation } from "../mutations";
import type { ActiveSessionsResponse } from "../types";

/**
 * Active Sessions Hook
 *
 * Fetches the list of active sessions for the current user.
 */
export const useActiveSessions = () => {
  const mutation = useActiveSessionsMutation();

  const getActiveSessions = useCallback(async (): Promise<ActiveSessionsResponse> => {
    const response = await mutation.mutateAsync();
    return response;
  }, [mutation]);

  return {
    getActiveSessions,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useActiveSessions;
