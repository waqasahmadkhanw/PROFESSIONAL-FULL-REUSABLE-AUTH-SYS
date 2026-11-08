"use client";

import { useCallback } from "react";

import { useRestoreAccountMutation } from "../mutations";
import type { RestoreAccountResponse } from "../types";

/**
 * Restore Account Hook
 *
 * Restores a deactivated account using a restore token.
 */
export const useRestoreAccount = () => {
  const mutation = useRestoreAccountMutation();

  const restoreAccount = useCallback(
    async (token: string) => {
      const response: RestoreAccountResponse = await mutation.mutateAsync({ token });
      return response;
    },
    [mutation]
  );

  return {
    restoreAccount,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useRestoreAccount;
