"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui";
import { Select } from "@/shared/components/ui/Select";
import { Switch } from "@/shared/components/ui/Switch";
import { Modal } from "@/shared/components/overlay";
import { SETTING_GROUPS, SETTING_VALUE_TYPES } from "../types";
import {
  SETTING_GROUP_LABELS,
  SETTING_VALUE_TYPE_LABELS,
} from "../constants";
import type {
  CreateSettingRequest,
  Setting,
  UpdateSettingRequest,
} from "../types";

interface SettingFormModalProps {
  open: boolean;
  setting: Setting | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    id?: string;
    data: CreateSettingRequest | UpdateSettingRequest;
  }) => void;
}

const groupOptions = SETTING_GROUPS.map((g) => ({
  value: g,
  label: SETTING_GROUP_LABELS[g],
}));

const valueTypeOptions = SETTING_VALUE_TYPES.map((t) => ({
  value: t,
  label: SETTING_VALUE_TYPE_LABELS[t],
}));

/**
 * Create/Edit setting form modal.
 * `setting` present → edit mode; otherwise create mode.
 */
export function SettingFormModal({
  open,
  setting,
  isSubmitting,
  onClose,
  onSubmit,
}: SettingFormModalProps) {
  const [key, setKey] = useState(setting?.key ?? "");
  const [label, setLabel] = useState(setting?.label ?? "");
  const [value, setValue] = useState(
    setting?.value !== undefined && setting?.value !== null
      ? String(setting.value)
      : ""
  );
  const [group, setGroup] = useState(setting?.group ?? "general");
  const [valueType, setValueType] = useState(
    setting?.valueType ?? "string"
  );
  const [isPublic, setIsPublic] = useState(setting?.isPublic ?? false);
  const [isSensitive, setIsSensitive] = useState(
    setting?.isSensitive ?? false
  );
  const [isActive, setIsActive] = useState(setting?.isActive ?? true);
  useEffect(() => {
    setKey(setting?.key ?? "");
    setLabel(setting?.label ?? "");
    setValue(setting?.value !== undefined && setting?.value !== null ? String(setting.value) : "");
    setGroup(setting?.group ?? "general");
    setValueType(setting?.valueType ?? "string");
    setIsPublic(setting?.isPublic ?? false);
    setIsSensitive(setting?.isSensitive ?? false);
    setIsActive(setting?.isActive ?? true);
  }, [setting, open]);

  const isKeyLocked = Boolean(setting);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let parsedValue: unknown = value;
    if (valueType === "number") parsedValue = Number(value);
    if (valueType === "boolean") parsedValue = value === "true";
    if (valueType === "json") {
      try {
        parsedValue = JSON.parse(value || "{}");
      } catch {
        parsedValue = value;
      }
    }
    if (valueType === "array") {
      try {
        const arr = JSON.parse(value || "[]");
        parsedValue = Array.isArray(arr) ? arr : [value];
      } catch {
        parsedValue = [value];
      }
    }

    if (setting) {
      onSubmit({
        id: setting._id,
        data: {
          label,
          value: parsedValue,
          group,
          valueType,
          isPublic,
          isSensitive,
          isActive,
        } as UpdateSettingRequest,
      });
    } else {
      onSubmit({
        data: {
          key: key.trim(),
          label,
          value: parsedValue,
          group,
          valueType,
          isPublic,
          isSensitive,
        } as CreateSettingRequest,
      });
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";
  const labelClasses = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={setting ? "Edit Setting" : "Create Setting"}
      description="Add or update a system configuration value."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClasses}>
            Key
          </label>
          <input
            type="text"
            required
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={isKeyLocked}
            className={`${inputClasses} ${
              isKeyLocked ? "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-500" : ""
            }`}
            placeholder="e.g. site_name"
          />
        </div>

        <div>
          <label className={labelClasses}>
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputClasses}
            placeholder="Human-friendly label"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Value
          </label>
          {valueType === "boolean" ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={inputClasses}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              className={inputClasses}
              placeholder={
                valueType === "json" || valueType === "array"
                  ? 'e.g. {"key": "value"}'
                  : "Setting value"
              }
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Group"
            value={group}
            onChange={(e) => setGroup(e.target.value as typeof group)}
            options={groupOptions}
          />
          <Select
            label="Value Type"
            value={valueType}
            onChange={(e) => setValueType(e.target.value as typeof valueType)}
            options={valueTypeOptions}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <Switch
            label="Public"
            helperText="Visible in public settings endpoint."
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <Switch
            label="Sensitive"
            helperText="Hide value from non-admin responses."
            checked={isSensitive}
            onChange={(e) => setIsSensitive(e.target.checked)}
          />
          {setting && (
            <Switch
              label="Active"
              helperText="Enabled setting."
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {setting ? "Save Changes" : "Create Setting"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
