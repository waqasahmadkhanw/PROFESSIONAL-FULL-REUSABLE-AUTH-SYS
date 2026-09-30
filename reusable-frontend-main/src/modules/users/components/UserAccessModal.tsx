"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Modal } from "@/shared/components/overlay/Modal";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useAllPermissionsQuery, useRolesQuery } from "@/modules/roles/queries";
import { useAssignUserPermissionsMutation } from "@/modules/roles/mutations";
import { useUserPermissionsQuery } from "@/modules/roles/queries/useUserPermissionsQuery";
import type { AdminUser } from "../types";
import type { UserRole } from "../types";
import { useChangeUserRoleMutation } from "../mutations";


export function UserAccessModal({ user, open, onClose }: { user: AdminUser | null; open: boolean; onClose: () => void }) {
  const toast = useToast();
  const { data: registry = [], isLoading: permissionsLoading } = useAllPermissionsQuery();
  const { data: rolesData } = useRolesQuery({ page: 1, limit: 100 });
  const { data: fetched } = useUserPermissionsQuery(user?._id);
  const assign = useAssignUserPermissionsMutation();
  const changeRole = useChangeUserRoleMutation();
  const [role, setRole] = useState<UserRole>(user?.role ?? "");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setRole(user.role);
    setSelected(fetched?.permissions ?? user.permissions ?? []);
  }, [user, fetched, open]);

  const roleDefaults = useMemo(
    () => rolesData?.roles.find((item) => item.slug === role || item.name.toLowerCase() === role.toLowerCase())?.permissions ?? [],
    [rolesData, role]
  );
  const effective = useMemo(() => selected.length ? selected : roleDefaults, [selected, roleDefaults]);
  const toggle = (permission: string) => setSelected((prev) => prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]);
  const save = async () => {
    if (!user) return;
    try {
      if (role !== user.role) await changeRole.mutateAsync({ id: user._id, role });
      await assign.mutateAsync({ userId: user._id, data: { permissions: selected } });
      toast.success("Role and permissions updated");
      onClose();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Failed to update access"); }
  };
  if (!user) return null;
  return <Modal open={open} onOpenChange={onClose} title="Role & Permissions" description={`Manage access for ${user.name}`}>
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40"><label className="mb-2 block text-sm font-semibold">Role</label><select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900">{rolesData?.roles.map((item) => (
              <option key={item._id} value={item.slug}>{item.name}</option>
            ))}</select></div>
      <div><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-semibold">Explicit permissions</p><p className="text-xs text-slate-500">Empty permissions use the backend role defaults.</p></div><span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">{effective.length} effective</span></div>
      {permissionsLoading ? <p className="text-sm text-slate-500">Loading permissions…</p> : <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">{registry.map((permission) => <label key={permission} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-medium ${selected.includes(permission) ? "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-500/10 dark:text-violet-200" : "border-slate-200 dark:border-slate-800"}`}><input type="checkbox" checked={selected.includes(permission)} onChange={() => toggle(permission)} className="rounded" />{permission.replaceAll("_", " ")}</label>)}</div>}</div>
      <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={assign.isPending || changeRole.isPending}><ShieldCheck className="mr-2 h-4 w-4" />{assign.isPending || changeRole.isPending ? "Saving…" : "Save access"}</Button></div>
    </div>
  </Modal>;
}
