import { useCallback } from "react";

import { useAppDispatch } from "@/shared/store";
import { useQueryClient } from "@tanstack/react-query";

import { useDeleteAccountMutation } from "../mutations";
import { logout } from "../store";
import { clearCsrfToken } from "@/shared/api";
import { emitLocalAuthSync, publishAuthSync } from "../utils/auth.sync";

export const useDeleteAccount = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useDeleteAccountMutation();

  const handleDeleteAccount = useCallback(async () => {
    try {
      await mutation.mutateAsync({});
    } finally {
      queryClient.removeQueries({ queryKey: ["auth"] });
      clearCsrfToken();
      dispatch(logout());
      emitLocalAuthSync("logout");
      publishAuthSync("logout");
    }
  }, [dispatch, mutation, queryClient]);

  return {
    deleteAccount: handleDeleteAccount,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useDeleteAccount;