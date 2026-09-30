import { useCallback } from "react";

import { useChangePasswordMutation } from "../mutations";
import type { ChangePasswordRequest } from "../types";

export const useChangePassword = () => {
  const mutation = useChangePasswordMutation();

  const changePassword = useCallback(
    async (payload: ChangePasswordRequest) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    changePassword,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useChangePassword;