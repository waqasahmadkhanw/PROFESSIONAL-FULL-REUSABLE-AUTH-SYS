"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  getAllPermissionsApi,
  getRoleByIdApi,
  getRolesApi,
} from "../api";
import type { RoleListResult, RoleQueryParams } from "../types";

/**
 * Fetch paginated role list.
 */
export const useRolesQuery = (params?: RoleQueryParams) => {
  return useQuery<RoleListResult>({
    queryKey: QUERY_KEYS.ROLES.LIST(params),
    queryFn: () => getRolesApi(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Fetch the full permission registry.
 */
export const useAllPermissionsQuery = () => {
  return useQuery<string[]>({
    queryKey: QUERY_KEYS.ROLES.PERMISSIONS,
    queryFn: () => getAllPermissionsApi(),
  });
};

/**
 * Fetch a single role.
 */
export const useRoleByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES.DETAILS(id ?? ""),
    queryFn: () => getRoleByIdApi(id!),
    enabled: Boolean(id),
  });
};

