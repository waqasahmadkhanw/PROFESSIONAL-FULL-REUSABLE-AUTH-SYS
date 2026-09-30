"use client";

import { useCallback } from "react";

import { useAppDispatch } from "@/shared/store";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";

import { useLoginMutation } from "../mutations";
import { loginSuccess } from "../store";
import type { LoginRequest, LoginResponse } from "../types";
import { emitLocalAuthSync, publishAuthSync } from "../utils/auth.sync";

/**
 * Login Hook
 *
 * Orchestrates the full login flow:
 *   useLogin()
 *     ↓ mutate → configured auth login endpoint
 *     ↓ backend sets HttpOnly auth cookies
 *     ↓ dispatch non-sensitive session state to Redux store
 *     ↓ (redirect is handled by GuestGuard in the auth layout)
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useLoginMutation();

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response: LoginResponse = await mutation.mutateAsync(payload);

      const { user } = response;

      queryClient.setQueryData(AUTH_QUERY_KEYS.CURRENT_USER, user);

      dispatch(
        loginSuccess({
          userId: user.id,
          roles: user.roles ?? (user.role ? [user.role] : []),
          permissions: user.permissions ?? [],
        })
      );

      emitLocalAuthSync("login");
      publishAuthSync("login");
      return response;
    },
    [dispatch, mutation, queryClient]
  );

  return {
    login,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useLogin;
