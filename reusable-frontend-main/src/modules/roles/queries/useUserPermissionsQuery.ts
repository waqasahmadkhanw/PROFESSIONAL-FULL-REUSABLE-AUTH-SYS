"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getUserPermissionsApi } from "../api";
export const useUserPermissionsQuery = (userId?: string) => useQuery({ queryKey: QUERY_KEYS.ROLES.USER_PERMISSIONS(userId ?? ""), queryFn: () => getUserPermissionsApi(userId!), enabled: Boolean(userId), });
