import { useCallback } from "react";

import { useRefreshTokenMutation } from "../mutations";

export const useRefreshToken = () => {
  const mutation = useRefreshTokenMutation();

  const refreshToken = useCallback(
    async () => {
      return mutation.mutateAsync();
    },
    [mutation]
  );

  return {
    refreshToken,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useRefreshToken;
