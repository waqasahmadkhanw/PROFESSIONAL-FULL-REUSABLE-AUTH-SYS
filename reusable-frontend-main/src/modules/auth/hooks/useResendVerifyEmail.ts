"use client";

import { useCallback } from "react";

import { useResendVerifyEmailMutation } from "../mutations";

/**
 * Resend Verify Email Hook
 *
 * Resends the email verification email.
 */
export const useResendVerifyEmail = () => {
  const mutation = useResendVerifyEmailMutation();

  const resendVerifyEmail = useCallback(
    async (email: string) => {
      const response = await mutation.mutateAsync({ email });
      return response;
    },
    [mutation]
  );

  return {
    resendVerifyEmail,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useResendVerifyEmail;
