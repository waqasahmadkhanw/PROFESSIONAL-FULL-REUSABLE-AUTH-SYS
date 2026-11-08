"use client";

import { useCallback } from "react";

import { useRequestEmailChangeMutation } from "../mutations";
import type { ChangeEmailResponse } from "../types";

/**
 * Request Email Change Hook
 *
 * Requests a change of email address for the current user.
 */
export const useRequestEmailChange = () => {
  const mutation = useRequestEmailChangeMutation();

  const requestEmailChange = useCallback(
    async (newEmail: string, password: string) => {
      const response: ChangeEmailResponse = await mutation.mutateAsync({ newEmail, password });
      return response;
    },
    [mutation]
  );

  return {
    requestEmailChange,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useRequestEmailChange;
