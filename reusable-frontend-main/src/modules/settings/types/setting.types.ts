// ============================================
// Settings Management Types (aligned with /api/settings)
// ============================================

export type SettingGroup =
  | "general"
  | "payments"
  | "email"
  | "security"
  | "notifications"
  | "other";

export type SettingValueType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "array";

/** Core setting document (matches Setting model). */
export interface Setting {
  _id: string;
  key: string;
  value: unknown;
  label: string;
  group: SettingGroup;
  valueType: SettingValueType;
  isSensitive: boolean;
  isPublic: boolean;
  isActive: boolean;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Paginated list response for GET /api/settings. */
export interface SettingListResult {
  settings: Setting[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

/** Query params for settings list (group/search/pagination). */
export interface SettingQueryParams {
  page?: number;
  limit?: number;
  group?: string;
  search?: string;
  [key: string]: unknown;
}

/** Body for POST /api/settings (create). */
export interface CreateSettingRequest {
  key: string;
  value?: unknown;
  label?: string;
  group?: SettingGroup;
  valueType?: SettingValueType;
  isSensitive?: boolean;
  isPublic?: boolean;
}

/** Body for PUT /api/settings/:id (update). */
export interface UpdateSettingRequest {
  value?: unknown;
  label?: string;
  group?: SettingGroup;
  valueType?: SettingValueType;
  isSensitive?: boolean;
  isPublic?: boolean;
  isActive?: boolean;
}

/** Body for PATCH /api/settings/bulk (bulk update). */
export interface BulkUpdateSettingsRequest {
  settings: { key: string; value: unknown }[];
}

export const SETTING_GROUPS: SettingGroup[] = [
  "general",
  "payments",
  "email",
  "security",
  "notifications",
  "other",
];

export const SETTING_VALUE_TYPES: SettingValueType[] = [
  "string",
  "number",
  "boolean",
  "json",
  "array",
];

