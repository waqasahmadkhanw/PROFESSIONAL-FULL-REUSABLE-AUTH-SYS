"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  bulkUpdateSettingsApi,
  createSettingApi,
  deleteSettingApi,
  updateSettingApi,
} from "../api";
import type {
  BulkUpdateSettingsRequest,
  CreateSettingRequest,
  UpdateSettingRequest,
} from "../types";

/**
 * Create a setting (admin).
 */
export const useCreateSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettingRequest) => createSettingApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS.ALL });
    },
  });
};

/**
 * Update a setting (admin).
 */
export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSettingRequest }) =>
      updateSettingApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS.ALL });
    },
  });
};

/**
 * Bulk update settings (admin).
 */
export const useBulkUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateSettingsRequest) => bulkUpdateSettingsApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS.ALL });
    },
  });
};

/**
 * Delete a setting (admin).
 */
export const useDeleteSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSettingApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS.ALL });
    },
  });
};
