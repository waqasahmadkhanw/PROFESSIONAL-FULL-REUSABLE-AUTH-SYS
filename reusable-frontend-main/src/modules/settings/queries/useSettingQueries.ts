"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  getSettingByIdApi,
  getSettingByKeyApi,
  getSettingsApi,
} from "../api";
import type { SettingListResult, SettingQueryParams } from "../types";

/**
 * Fetch paginated settings list (admin).
 */
export const useSettingsQuery = (params?: SettingQueryParams) => {
  return useQuery<SettingListResult>({
    queryKey: QUERY_KEYS.SETTINGS.LIST(params),
    queryFn: () => getSettingsApi(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Fetch a single setting by id.
 */
export const useSettingByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS.DETAILS(id ?? ""),
    queryFn: () => getSettingByIdApi(id!),
    enabled: Boolean(id),
  });
};

/**
 * Fetch a setting by key.
 */
export const useSettingByKeyQuery = (key?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS.KEY(key ?? ""),
    queryFn: () => getSettingByKeyApi(key!),
    enabled: Boolean(key),
  });
};
