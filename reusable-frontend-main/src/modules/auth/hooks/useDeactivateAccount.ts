"use client";

import { useCallback } from "react";

import { useDeactivateAccountMutation } from "../mutations";
import type { DeactivateAccountResponse } from "../types";

/**
 * Deactivate Account Hook
 *
 * Deactivates the current user's account.
 */
export const useDeactivateAccount = () => {
  const mutation = useDeactivateAccountMutation();

  const deactivateAccount = useCallback(
    async (password: string) => {
      const response: DeactivateAccountResponse = await mutation.mutateAsync({ password });
      return response;
    },
    [mutation]
  );

  return {
    deactivateAccount,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useDeactivateAccount;
