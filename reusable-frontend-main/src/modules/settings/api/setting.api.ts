import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type {
  BulkUpdateSettingsRequest,
  CreateSettingRequest,
  Setting,
  SettingListResult,
  SettingQueryParams,
  UpdateSettingRequest,
} from "../types";

/**
 * GET /api/settings — paginated settings list (admin).
 */
export const getSettingsApi = async (
  params?: SettingQueryParams
): Promise<SettingListResult> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.SETTINGS.LIST, { params });
  const payload = result as {
    settings?: Setting[];
    pagination?: SettingListResult["pagination"];
  };
  return {
    settings: payload.settings ?? [],
    pagination: payload.pagination ?? { total: 0, page: params?.page ?? 1, pages: 1 },
  };
};

/**
 * GET /api/settings/:id — single setting.
 */
export const getSettingByIdApi = async (id: string): Promise<Setting> => {
  return apiClient.get<Setting>(API_ENDPOINTS.SETTINGS.DETAILS(id));
};

/**
 * GET /api/settings/key/:key — setting by key.
 */
export const getSettingByKeyApi = async (key: string): Promise<Setting> => {
  return apiClient.get<Setting>(API_ENDPOINTS.SETTINGS.BY_KEY(key));
};

/**
 * POST /api/settings — create a setting.
 */
export const createSettingApi = async (
  data: CreateSettingRequest
): Promise<Setting> => {
  // The current backend create validator does not allow `value`.
  // Create the setting metadata first, then use bulk update for its value.
  const { value, ...metadata } = data;
  const setting = await apiClient.post<Setting>(API_ENDPOINTS.SETTINGS.CREATE, metadata);

  if (value !== undefined) {
    const updated = await apiClient.patch<Setting[]>(
      API_ENDPOINTS.SETTINGS.BULK_UPDATE,
      { settings: [{ key: setting.key, value }] },
    );
    return updated[0] ?? setting;
  }

  return setting;
};

/**
 * PATCH /api/settings/:id — update a setting.
 */
export const updateSettingApi = async (
  id: string,
  data: UpdateSettingRequest
): Promise<Setting> => {
  const { value, ...metadata } = data;
  const updated = await apiClient.patch<Setting>(
    API_ENDPOINTS.SETTINGS.UPDATE(id),
    metadata,
  );

  if (value === undefined) return updated;

  const result = await apiClient.patch<Setting[]>(
    API_ENDPOINTS.SETTINGS.BULK_UPDATE,
    { settings: [{ key: updated.key, value }] },
  );

  return result[0] ?? updated;
};

/**
 * PATCH /api/settings/bulk — bulk update settings by key.
 */
export const bulkUpdateSettingsApi = async (
  data: BulkUpdateSettingsRequest
): Promise<Setting[]> => {
  return apiClient.patch<Setting[]>(API_ENDPOINTS.SETTINGS.BULK_UPDATE, data);
};

/**
 * DELETE /api/settings/:id — delete a setting.
 */
export const deleteSettingApi = async (id: string): Promise<null> => {
  return apiClient.delete<null>(API_ENDPOINTS.SETTINGS.DELETE(id));
};

export const settingApi = {
  getSettings: getSettingsApi,
  getById: getSettingByIdApi,
  getByKey: getSettingByKeyApi,
  create: createSettingApi,
  update: updateSettingApi,
  bulkUpdate: bulkUpdateSettingsApi,
  delete: deleteSettingApi,
} as const;


export const getPublicSettingsApi = async (): Promise<Setting[]> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.SETTINGS.PUBLIC);
  const payload = result as { settings?: Setting[] } | Setting[];
  return Array.isArray(payload) ? payload : (payload.settings ?? []);
};
