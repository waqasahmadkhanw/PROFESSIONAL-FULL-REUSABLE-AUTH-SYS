"use client";

import { KeyRound, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Badge } from "@/shared/components/ui";
import { SETTING_GROUP_LABELS } from "../constants";
import type { Setting } from "../types";
import { SettingValueTypeBadge, formatSettingValue } from "./SettingValueBadge";

interface SettingsTableProps {
  settings: Setting[];
  onEdit: (setting: Setting) => void;
  onDelete: (setting: Setting) => void;
}

/**
 * Enterprise-grade settings table.
 */
export function SettingsTable({
  settings,
  onEdit,
  onDelete,
}: SettingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="px-4 py-3 font-medium">Key</th>
            <th className="px-4 py-3 font-medium">Label</th>
            <th className="px-4 py-3 font-medium">Value</th>
            <th className="px-4 py-3 font-medium">Group</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Public</th>
            <th className="px-4 py-3 font-medium">Active</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr
              key={setting._id}
              className="border-b border-slate-200 bg-white last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-900">
                    {setting.key}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-700">{setting.label || "—"}</td>
              <td className="max-w-[200px] truncate px-4 py-3 text-slate-700">
                {setting.isSensitive ? (
                  <span className="text-slate-400">••••••••</span>
                ) : (
                  formatSettingValue(setting.value)
                )}
              </td>
              <td className="px-4 py-3">
                <Badge className="bg-slate-100 text-slate-700">
                  {SETTING_GROUP_LABELS[setting.group] ?? setting.group}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <SettingValueTypeBadge valueType={setting.valueType} />
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={
                    setting.isPublic
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }
                >
                  {setting.isPublic ? "Yes" : "No"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={
                    setting.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }
                >
                  {setting.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Pencil className="h-4 w-4" />}
                    onClick={() => onEdit(setting)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => onDelete(setting)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
</table>
    </div>
  );
}
