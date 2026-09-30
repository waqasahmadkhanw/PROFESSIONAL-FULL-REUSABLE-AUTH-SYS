import { useCallback } from "react";

import { useResetPasswordMutation } from "../mutations";
import type { ResetPasswordRequest } from "../types";

export const useResetPassword = () => {
  const mutation = useResetPasswordMutation();

  const resetPassword = useCallback(
    async (payload: ResetPasswordRequest) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    resetPassword,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useResetPassword;