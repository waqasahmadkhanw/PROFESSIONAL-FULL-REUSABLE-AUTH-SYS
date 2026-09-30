"use client";

import {
  useBulkUpdateSettingsMutation,
  useCreateSettingMutation,
  useDeleteSettingMutation,
  useUpdateSettingMutation,
} from "../mutations";
import { useSettingsQuery } from "../queries";
import type {
  BulkUpdateSettingsRequest,
  CreateSettingRequest,
  SettingQueryParams,
  UpdateSettingRequest,
} from "../types";

/**
 * Convenience hook exposing settings list query + mutations.
 */
export const useSettings = (params?: SettingQueryParams) => {
  const query = useSettingsQuery(params);
  const createMutation = useCreateSettingMutation();
  const updateMutation = useUpdateSettingMutation();
  const bulkMutation = useBulkUpdateSettingsMutation();
  const deleteMutation = useDeleteSettingMutation();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createSetting: (payload: CreateSettingRequest) =>
      createMutation.mutateAsync(payload),
    isCreating: createMutation.isPending,
    updateSetting: (id: string, data: UpdateSettingRequest) =>
      updateMutation.mutateAsync({ id, data }),
    isUpdating: updateMutation.isPending,
    bulkUpdate: (settings: BulkUpdateSettingsRequest) =>
      bulkMutation.mutateAsync(settings),
    isBulkUpdating: bulkMutation.isPending,
    deleteSetting: (id: string) => deleteMutation.mutateAsync(id),
    isDeleting: deleteMutation.isPending,
  };
};

export default useSettings;

