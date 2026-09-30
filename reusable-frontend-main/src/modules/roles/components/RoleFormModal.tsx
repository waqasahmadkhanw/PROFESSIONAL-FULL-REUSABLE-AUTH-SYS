"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Search,
  Shield,
  Tag,
  FileText,
  CheckSquare,
  Square,
  X,
  Lock,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Modal } from "@/shared/components/overlay";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "@/shared/constants";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "../types";

interface RoleFormModalProps {
  open: boolean;
  role: Role | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    id?: string;
    data: CreateRoleRequest | UpdateRoleRequest;
  }) => void;
}

interface RoleFormBodyProps {
  role: Role | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: RoleFormModalProps["onSubmit"];
}

interface PermissionGroup {
  id: string;
  title: string;
  permissions: string[];
}

const CATEGORIZED_GROUPS: PermissionGroup[] = [
  {
    id: "users",
    title: "User Management",
    permissions: ["read_users", "create_users", "update_users", "delete_users"],
  },
  {
    id: "access",
    title: "Roles & Access",
    permissions: ["manage_roles"],
  },
  {
    id: "commerce",
    title: "Payments & Commerce",
    permissions: ["manage_payments", "manage_coupons"],
  },
  {
    id: "system",
    title: "System & Operations",
    permissions: [
      "manage_media",
      "manage_notifications",
      "manage_announcements",
      "manage_events",
      "manage_settings",
      "view_activity_logs",
    ],
  },
];

/**
  * Inner form body. Resets state on mount/open.
  */
function RoleFormBody({
  role,
  isSubmitting,
  onClose,
  onSubmit,
}: RoleFormBodyProps) {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selected, setSelected] = useState<string[]>(role?.permissions ?? []);
  const [searchQuery, setSearchQuery] = useState("");

  const allSelected = selected.length === ALL_PERMISSIONS.length;

  const togglePermission = (permission: string) => {
    setSelected((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : [...ALL_PERMISSIONS]);
  };

  const toggleGroup = (groupPermissions: string[]) => {
    const allGroupSelected = groupPermissions.every((p) =>
      selected.includes(p)
    );
    if (allGroupSelected) {
      setSelected((prev) => prev.filter((p) => !groupPermissions.includes(p)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...groupPermissions])));
    }
  };

  // Build grouped permission structure plus uncategorized fallback
  const groupsWithFallback = useMemo(() => {
    const categorizedSet = new Set<string>();
    CATEGORIZED_GROUPS.forEach((g) =>
      g.permissions.forEach((p) => categorizedSet.add(p))
    );

    const uncategorized = ALL_PERMISSIONS.filter((p) => !categorizedSet.has(p));

    const result = [...CATEGORIZED_GROUPS];
    if (uncategorized.length > 0) {
      result.push({
        id: "other",
        title: "Other Permissions",
        permissions: uncategorized,
      });
    }
    return result;
  }, []);

  // Filter groups by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupsWithFallback;
    const q = searchQuery.toLowerCase();

    return groupsWithFallback
      .map((group) => {
        const filtered = group.permissions.filter((p) => {
          const label = PERMISSION_LABELS[p] ?? p;
          return (
            label.toLowerCase().includes(q) ||
            p.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q)
          );
        });
        return { ...group, permissions: filtered };
      })
      .filter((group) => group.permissions.length > 0);
  }, [groupsWithFallback, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      description: description.trim(),
      permissions: selected,
    };

    if (role) {
      onSubmit({ id: role._id, data: payload });
    } else {
      onSubmit({ data: payload as CreateRoleRequest });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role Name */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Tag className="h-3.5 w-3.5 text-indigo-500" />
          Role Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
          placeholder="e.g. Content Manager"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <FileText className="h-3.5 w-3.5 text-slate-500" />
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
          placeholder="Briefly describe what responsibilities or access this role holds"
        />
      </div>

      {/* Permissions Section */}
      <div className="space-y-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Shield className="h-3.5 w-3.5 text-indigo-500" />
              Permissions Access
            </label>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
              {selected.length} / {ALL_PERMISSIONS.length} selected
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {allSelected ? (
              <>
                <Square className="h-3.5 w-3.5" />
                Clear All
              </>
            ) : (
              <>
                <CheckSquare className="h-3.5 w-3.5" />
                Select All ({ALL_PERMISSIONS.length})
              </>
            )}
          </button>
        </div>

        {/* Search input for permissions */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search permissions by name..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Categorized Permissions Grid */}
        <div className="max-h-[340px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-4 dark:border-slate-800 dark:bg-slate-900/40">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => {
              const groupSelectedCount = group.permissions.filter((p) =>
                selected.includes(p)
              ).length;
              const isGroupAllSelected =
                group.permissions.length > 0 &&
                groupSelectedCount === group.permissions.length;

              return (
                <div
                  key={group.id}
                  className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900"
                >
                  {/* Category Header */}
                  <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {group.title}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {groupSelectedCount}/{group.permissions.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleGroup(group.permissions)}
                      className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {isGroupAllSelected ? "Deselect group" : "Select group"}
                    </button>
                  </div>

                  {/* Category Permission Items */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.permissions.map((permission) => {
                      const checked = selected.includes(permission);
                      const label = PERMISSION_LABELS[permission] ?? permission;

                      return (
                        <label
                          key={permission}
                          className={`group/item flex cursor-pointer items-center justify-between rounded-md border px-2.5 py-1.5 transition-all select-none ${
                            checked
                              ? "border-indigo-300 bg-indigo-50/70 text-indigo-950 dark:border-indigo-700/60 dark:bg-indigo-950/40 dark:text-indigo-200"
                              : "border-slate-200/80 bg-slate-50/40 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(permission)}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                            />
                            <div className="flex flex-col overflow-hidden">
                              <span className="truncate text-xs font-medium">
                                {label}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                {permission}
                              </span>
                            </div>
                          </div>

                          {checked && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No permissions match "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {role ? "Save Changes" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}

/**
  * Create/Edit role form modal with grouped permissions & interactive search.
  */
export function RoleFormModal({
  open,
  role,
  isSubmitting,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={role ? `Edit Role — ${role.name}` : "Create New Role"}
      size="lg"
    >
      {open && (
        <RoleFormBody
          key={role?._id ?? "new"}
          role={role}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}

