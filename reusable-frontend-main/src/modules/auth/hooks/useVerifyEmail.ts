"use client";

import { useCallback } from "react";

import { useVerifyEmailMutation } from "../mutations";

/**
 * Verify Email Hook
 *
 * Verifies the email verification token.
 */
export const useVerifyEmail = () => {
  const mutation = useVerifyEmailMutation();

  const verifyEmail = useCallback(
    async (token: string) => {
      const response = await mutation.mutateAsync({ token });
      return response;
    },
    [mutation]
  );

  return {
    verifyEmail,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useVerifyEmail;
