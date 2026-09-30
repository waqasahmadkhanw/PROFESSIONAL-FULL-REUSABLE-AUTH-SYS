"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAppDispatch } from "@/shared/store";
import { authService } from "../services/auth.service";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";
import { loginSuccess, logout } from "../store";

/**
 * Restores the UI session from the backend HttpOnly cookie.
 * No JWT is persisted in localStorage.
 */
export const useCurrentUserQuery = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.CURRENT_USER,
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(
        loginSuccess({
          userId: query.data.id,
          roles: query.data.role ? [query.data.role] : [],
          permissions: query.data.permissions ?? [],
        })
      );
      queryClient.setQueryData(AUTH_QUERY_KEYS.PERMISSIONS, query.data.permissions ?? []);
    }

    if (query.isError && query.error && "statusCode" in query.error) {
      const statusCode = (query.error as { statusCode?: number }).statusCode;
      if (statusCode === 401 || statusCode === 403) {
        dispatch(logout());
      }
    }
  }, [dispatch, query.data, query.error, query.isError, query.isSuccess]);

  return query;
};
