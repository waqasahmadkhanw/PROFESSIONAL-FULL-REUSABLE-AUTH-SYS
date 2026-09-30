import { useCallback, useMemo } from "react";

import { useAppDispatch } from "@/shared/store";

import { logout } from "../store";
import { useLogout } from "./useLogout";
import { useCurrentUserQuery } from "../queries/useCurrentUserQuery";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { logout: logoutFromServer, isPending: isLogoutPending } = useLogout();

  const { data: user, isPending: isSessionPending, isFetching: isSessionFetching, error: sessionError } = useCurrentUserQuery();
  const isAuthenticated = Boolean(user);

  const isLoading = isSessionPending || isSessionFetching;
  const handleLogout = useCallback(async () => {
    try {
      await logoutFromServer();
    } finally {
      dispatch(logout());
    }
  }, [dispatch, logoutFromServer]);

  return useMemo(
    () => ({
      user,
      isLogoutPending,
      isAuthenticated,
      isLoading,
      sessionError,
      logout: handleLogout,
    }),
    [
      user,
      isLogoutPending,
      isAuthenticated,
      isLoading,
      sessionError,
      handleLogout,
    ]
  );
};

export default useAuth;
