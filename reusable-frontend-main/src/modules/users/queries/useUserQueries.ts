"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  getUsersApi,
} from "../api";
import type { UserQueryParams } from "../types";

/**
 * Fetch paginated users list.
 */
export const useUsersQuery = (params?: UserQueryParams, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(params),
    queryFn: () => getUsersApi(params),
    enabled,
    placeholderData: (prev) => prev,
  });
};
