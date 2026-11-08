"use client";

import { useCallback } from "react";

import { useAppDispatch } from "@/shared/store";

import { useGoogleLoginMutation } from "../mutations";
import { loginSuccess } from "../store";
import type { GoogleLoginResponse } from "../types";

/**
 * Google Login Hook
 *
 * Authenticates the user via Google OAuth credential.
 */
export const useGoogleLogin = () => {
  const dispatch = useAppDispatch();
  const mutation = useGoogleLoginMutation();

  const googleLogin = useCallback(
    async (credential: string) => {
      const response: GoogleLoginResponse = await mutation.mutateAsync({ credential });

      const { user } = response;

      dispatch(
        loginSuccess({
          userId: user.id,
          roles: user.roles ?? (user.role ? [user.role] : []),
          permissions: user.permissions ?? [],
        })
      );

      return response;
    },
    [dispatch, mutation]
  );

  return {
    googleLogin,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useGoogleLogin;
