import { settingApi } from "../api";
import type {
  BulkUpdateSettingsRequest,
  CreateSettingRequest,
  Setting,
  SettingListResult,
  SettingQueryParams,
  UpdateSettingRequest,
} from "../types";

/**
 * Settings Service
 *
 * Orchestrates data access for setting management. Keeps the
 * data-fetching concern separate from the UI layer.
 */
export const settingService = {
  list: (params?: SettingQueryParams): Promise<SettingListResult> =>
    settingApi.getSettings(params),

  byId: (id: string): Promise<Setting> => settingApi.getById(id),

  byKey: (key: string): Promise<Setting> => settingApi.getByKey(key),

  create: (data: CreateSettingRequest): Promise<Setting> =>
    settingApi.create(data),

  update: (id: string, data: UpdateSettingRequest): Promise<Setting> =>
    settingApi.update(id, data),

  bulkUpdate: (data: BulkUpdateSettingsRequest): Promise<Setting[]> =>
    settingApi.bulkUpdate(data),

  remove: (id: string): Promise<null> => settingApi.delete(id),
} as const;
