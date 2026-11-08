"use client";

import { useCallback } from "react";

import { useVerifyEmailChangeMutation } from "../mutations";
import type { VerifyEmailChangeResponse } from "../types";

/**
 * Verify Email Change Hook
 *
 * Verifies the email change token.
 */
export const useVerifyEmailChange = () => {
  const mutation = useVerifyEmailChangeMutation();

  const verifyEmailChange = useCallback(
    async (token: string) => {
      const response: VerifyEmailChangeResponse = await mutation.mutateAsync({ token });
      return response;
    },
    [mutation]
  );

  return {
    verifyEmailChange,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useVerifyEmailChange;
