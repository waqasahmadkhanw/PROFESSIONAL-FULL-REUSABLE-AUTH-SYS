"use client";

import { Badge } from "@/shared/components/ui";
import type { Setting, SettingValueType } from "../types";

const VALUE_TYPE_STYLES: Record<SettingValueType, string> = {
  string: "bg-slate-100 text-slate-700",
  number: "bg-sky-50 text-sky-700",
  boolean: "bg-indigo-50 text-indigo-700",
  json: "bg-amber-50 text-amber-700",
  array: "bg-emerald-50 text-emerald-700",
};

/**
 * Displays the value type of a setting as a small badge.
 */
export function SettingValueTypeBadge({
  valueType,
}: {
  valueType: SettingValueType;
}) {
  return (
    <Badge className={VALUE_TYPE_STYLES[valueType] ?? "bg-slate-100 text-slate-700"}>
      {valueType}
    </Badge>
  );
}

/**
 * Formats a setting value for display (safe for arbitrary data types).
 */
export function formatSettingValue(value: Setting["value"]): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
return String(value);
}
