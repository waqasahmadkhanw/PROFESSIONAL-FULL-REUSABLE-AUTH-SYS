"use client";

import React, { useState, useMemo } from "react";
import { Plus, ShieldCheck, Shield, Lock, KeyRound, Search, CheckCircle, X, Layers, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/navigation";
import { Pagination } from "@/shared/components/navigation";
import {
  EmptyState,
  ErrorState,
  Loading,
} from "@/shared/components/feedback";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { PERMISSION_LABELS } from "@/shared/constants";
import { useRoles } from "../hooks";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "../types";
import {
  RoleDeleteDialog,
  RoleFormModal,
  RolesTable,
} from "../components";

const PAGE_SIZE = 10;

/**
 * Roles & Permissions admin page with statistics, quick filters,
 * interactive permissions registry and role management modal.
 */
export function RolesPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Client-side table filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Registry search filter
  const [registrySearch, setRegistrySearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    permissions,
    permissionsLoading,
    createRole,
    updateRole,
    deleteRole,
    toggleStatus,
    isMutating,
  } = useRoles({ page, limit: PAGE_SIZE, search: searchQuery.trim() || undefined, isActive: statusFilter === "all" ? undefined : statusFilter === "active" });

  const rawRoles = data?.roles ?? data;
  const roles = useMemo(() => {
    if (Array.isArray(rawRoles)) return rawRoles as Role[];
    if (Array.isArray(data?.roles)) return data.roles as Role[];
    return [] as Role[];
  }, [data, rawRoles]);

  const pagination = data?.pagination;

  // Search and active status are sent to the backend. Do not client-filter a paginated page.
  const filteredRoles = roles;

  // Statistics
  const totalRolesCount = pagination?.total ?? roles.length;
  const activeRolesCount = roles.filter((r) => r?.isActive).length;
  const systemRolesCount = roles.filter((r) => r?.isSystem).length;
  const totalPermissionsCount = Array.isArray(permissions) ? permissions.length : 0;

  // Filtered registry permissions
  const filteredRegistryPermissions = useMemo(() => {
    if (!Array.isArray(permissions)) return [];
    if (!registrySearch.trim()) return permissions;
    const q = registrySearch.toLowerCase();
    return permissions.filter((p) => {
      if (!p) return false;
      const label = PERMISSION_LABELS[p] ?? p;
      return label.toLowerCase().includes(q) || p.toLowerCase().includes(q);
    });
  }, [permissions, registrySearch]);

  const handleSubmit = async (payload: {
    id?: string;
    data: CreateRoleRequest | UpdateRoleRequest;
  }) => {
    try {
      if (payload.id) {
        await updateRole({ id: payload.id, data: payload.data });
        toast.success("Role updated successfully");
      } else {
        await createRole(payload.data as CreateRoleRequest);
        toast.success("Role created successfully");
      }
      setFormOpen(false);
      setEditingRole(null);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (role: Role) => {
    try {
      await deleteRole(role._id);
      toast.success("Role deleted successfully");
      setDeletingRole(null);
    } catch {
      toast.error("Failed to delete role");
    }
  };

  const handleToggleStatus = async (role: Role) => {
    try {
      await toggleStatus(role._id);
      toast.success(
        role.isActive ? "Role deactivated" : "Role activated"
      );
    } catch {
      toast.error("Failed to update role status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles, access control levels, and granular platform permissions."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingRole(null);
              setFormOpen(true);
            }}
          >
            Create Role
          </Button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Roles */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Total Roles
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalRolesCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              roles configured
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-80" />
        </div>

        {/* Active Roles */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Active Status · page
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeRolesCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              active on page
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
        </div>

        {/* System Roles */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              System Protected · page
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {systemRolesCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              system roles on page
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80" />
        </div>

        {/* Total Permissions */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Permissions Registry
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400">
              <KeyRound className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalPermissionsCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              granular permissions
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-80" />
        </div>
      </div>

      {/* Main Table Card Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search roles by name, slug or description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setPage(1); }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Backend-supported status filter */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1 dark:border-slate-800 dark:bg-slate-800/60">
            <button type="button" onClick={() => { setStatusFilter("all"); setPage(1); }} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusFilter === "all" ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>All Status</button>
            <button type="button" onClick={() => { setStatusFilter("active"); setPage(1); }} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusFilter === "active" ? "bg-white text-emerald-600 shadow-2xs dark:bg-slate-900 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>Active</button>
            <button type="button" onClick={() => { setStatusFilter("inactive"); setPage(1); }} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusFilter === "inactive" ? "bg-white text-slate-700 shadow-2xs dark:bg-slate-900 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"}`}>Inactive</button>
          </div>
        </div>

        {/* Roles Table */}
        {isLoading ? (
          <Loading message="Loading roles..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load roles"
            message={error?.message ?? "Please try again."}
            onRetry={() => {
              refetch();
            }}
          />
        ) : roles.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="h-10 w-10 text-slate-300 dark:text-slate-700" />}
            title="No roles found"
            description="Create your first role to start managing platform access permissions."
          />
        ) : (
          <RolesTable
            roles={filteredRoles}
            onEdit={(role) => {
              setEditingRole(role);
              setFormOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            onDelete={(role) => setDeletingRole(role)}
          />
        )}

        {pagination && pagination.pages > 1 && (
          <div className="pt-2">
            <Pagination
              page={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Role Create / Edit Modal */}
      <RoleFormModal
        open={formOpen}
        role={editingRole}
        isSubmitting={isMutating}
        onClose={() => {
          setFormOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSubmit}
      />

      {/* Role Delete Dialog */}
      <RoleDeleteDialog
        role={deletingRole}
        isSubmitting={isMutating}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDelete}
      />

      {/* Permission Registry Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Global Permission Registry
              </h3>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                {totalPermissionsCount} Available
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              The full ecosystem of authorization keys available for custom roles.
            </p>
          </div>

          {/* Search Registry */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={registrySearch}
              onChange={(e) => setRegistrySearch(e.target.value)}
              placeholder="Filter permissions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {registrySearch && (
              <button
                type="button"
                onClick={() => setRegistrySearch("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {permissionsLoading ? (
          <Loading message="Loading permissions..." />
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {filteredRegistryPermissions.length > 0 ? (
              filteredRegistryPermissions.map((permission) => {
                const label = PERMISSION_LABELS[permission] ?? permission;
                return (
                  <div
                    key={permission}
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-900 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-700/60 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-200"
                  >
                    <span className="font-semibold">{label}</span>
                    <span className="font-mono text-[10px] text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400">
                      ({permission})
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-xs text-slate-500 dark:text-slate-400">
                No permissions match "{registrySearch}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
