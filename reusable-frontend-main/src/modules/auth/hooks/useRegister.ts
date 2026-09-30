import { useCallback } from "react";

import { useRegisterMutation } from "../mutations";
import type { RegisterRequest } from "../types";

export const useRegister = () => {
  const mutation = useRegisterMutation();

  const register = useCallback(
    async (payload: RegisterRequest) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    register,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useRegister;