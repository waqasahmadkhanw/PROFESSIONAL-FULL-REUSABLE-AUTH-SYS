import type { SettingGroup, SettingValueType } from "../types";

export const SETTING_GROUP_LABELS: Record<SettingGroup, string> = {
  general: "General",
  payments: "Payments",
  email: "Email",
  security: "Security",
  notifications: "Notifications",
  other: "Other",
};

export const SETTING_VALUE_TYPE_LABELS: Record<SettingValueType, string> = {
  string: "String",
  number: "Number",
  boolean: "Boolean",
  json: "JSON",
  array: "Array",
};

export default SETTING_GROUP_LABELS;
