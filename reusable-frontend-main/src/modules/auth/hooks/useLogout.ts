import { useCallback } from "react";

import { useAppDispatch } from "@/shared/store";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";

import { useLogoutMutation } from "../mutations";
import { logout } from "../store";
import { clearCsrfToken } from "@/shared/api";
import { emitLocalAuthSync, publishAuthSync } from "../utils/auth.sync";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await mutation.mutateAsync();
    } finally {
      // The backend clears HttpOnly cookies. Remove the cached current user
      // as well so a subsequent login cannot briefly display the old account.
      queryClient.removeQueries({ queryKey: ["auth"] });
      clearCsrfToken();
      dispatch(logout());
      emitLocalAuthSync("logout");
      publishAuthSync("logout");
    }
  }, [dispatch, mutation, queryClient]);

  return {
    logout: handleLogout,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useLogout;
