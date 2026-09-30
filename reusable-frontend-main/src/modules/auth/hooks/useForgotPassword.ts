import { useCallback } from "react";

import { useForgotPasswordMutation } from "../mutations";
import type { ForgotPasswordRequest } from "../types";

export const useForgotPassword = () => {
  const mutation = useForgotPasswordMutation();

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordRequest) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    forgotPassword,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useForgotPassword;