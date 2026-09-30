"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";

/**
 * Fetch the authenticated user's effective permission payload.
 * The current backend exposes permissions as part of the current-user
 * response; there is no public /user/permissions endpoint.
 */
export const usePermissionsQuery = () => {
  return useQuery<string[]>({
    queryKey: AUTH_QUERY_KEYS.PERMISSIONS,
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      return user.permissions ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });
};
