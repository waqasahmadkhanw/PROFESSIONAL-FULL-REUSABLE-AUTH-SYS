// "use client";

// import { ShieldCheck } from "lucide-react";
// import type { Role } from "../types";
// import { RoleStatusBadge } from "./RoleStatusBadge";
// import { RoleSystemBadge } from "./RoleSystemBadge";

// export interface RolesTableProps {
//   roles: Role[];
//   onEdit: (role: Role) => void;
//   onToggleStatus: (role: Role) => void;
//   onDelete: (role: Role) => void;
// }

// function getActorName(
//   actor: string | { name?: string } | undefined
// ): string {
//   if (!actor) return "—";
//   if (typeof actor === "string") return "—";
//   return actor.name ?? "—";
// }

// /**
//  * Enterprise-grade roles table aligned with the application color system.
//  */
// export function RolesTable({
//   roles,
//   onEdit,
//   onToggleStatus,
//   onDelete,
// }: RolesTableProps) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-600">
//             <th className="px-6 py-3">Role</th>
//             <th className="px-6 py-3">Slug</th>
//             <th className="px-6 py-3">Permissions</th>
//             <th className="px-6 py-3">Type</th>
//             <th className="px-6 py-3">Status</th>
//             <th className="px-6 py-3">Created By</th>
//             <th className="px-6 py-3 text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-200 bg-white">
//           {roles.map((role) => (
//             <tr key={role._id} className="hover:bg-slate-50">
//               <td className="px-6 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
//                     <ShieldCheck className="h-5 w-5 text-indigo-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-slate-900">{role.name}</p>
//                     <p className="text-slate-500">{role.description}</p>
//                   </div>
//                 </div>
//               </td>
//               <td className="px-6 py-4 font-mono text-xs text-slate-500">
//                 {role.slug}
//               </td>
//               <td className="px-6 py-4">
//                 <span className="font-medium text-slate-700">
//                   {role.permissions.length}
//                 </span>
//                 <span className="text-slate-500"> permissions</span>
//               </td>
//               <td className="px-6 py-4">
//                 <RoleSystemBadge isSystem={role.isSystem} />
//               </td>
//               <td className="px-6 py-4">
//                 <RoleStatusBadge isActive={role.isActive} />
//               </td>
//               <td className="px-6 py-4 text-slate-500">
//                 {getActorName(role.createdBy)}
//               </td>
//               <td className="px-6 py-4">
//                 <div className="flex items-center justify-end gap-2">
//                   <button
//                     onClick={() => onToggleStatus(role)}
//                     disabled={role.isSystem}
//                     className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {role.isActive ? "Deactivate" : "Activate"}
//                   </button>
//                   <button
//                     onClick={() => onEdit(role)}
//                     className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => onDelete(role)}
//                     disabled={role.isSystem}
//                     className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
"use client";

import React from "react";
import {
  ShieldCheck,
  Shield,
  Pencil,
  Power,
  Trash2,
  KeyRound,
  UserCheck,
} from "lucide-react";
import type { Role } from "../types";
import { RoleStatusBadge } from "./RoleStatusBadge";
import { RoleSystemBadge } from "./RoleSystemBadge";
import { PERMISSION_LABELS } from "@/shared/constants";

export interface RolesTableProps {
  roles?: Role[];
  onEdit: (role: Role) => void;
  onToggleStatus: (role: Role) => void;
  onDelete: (role: Role) => void;
}

function getActorName(
  actor: string | { name?: string } | undefined
): string {
  if (!actor) return "—";
  if (typeof actor === "string") return "—";
  return actor.name ?? "—";
}

/**
 * Modern, enterprise-grade roles table with dark mode and interactive actions.
 */
export function RolesTable({
  roles = [],
  onEdit,
  onToggleStatus,
  onDelete,
}: RolesTableProps) {
  const safeRoles = Array.isArray(roles) ? roles : [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="px-6 py-3.5">Role</th>
              <th className="px-6 py-3.5">Slug</th>
              <th className="px-6 py-3.5">Permissions</th>
              <th className="px-6 py-3.5">Type</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Created By</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white dark:divide-slate-800/80 dark:bg-slate-900">
            {safeRoles.length > 0 ? (
              safeRoles.map((role) => {
                const permissionCount = role.permissions?.length ?? 0;
                const samplePermissions = (role.permissions ?? [])
                  .slice(0, 2)
                  .map((p) => PERMISSION_LABELS[p] ?? p);
                const remainingCount = Math.max(0, permissionCount - 2);

                return (
                  <tr
                    key={role._id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    {/* Role Name & Description */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                            role.isSystem
                              ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/30"
                              : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/30"
                          }`}
                        >
                          {role.isSystem ? (
                            <ShieldCheck className="h-5 w-5" />
                          ) : (
                            <Shield className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {role.name}
                            </p>
                          </div>
                          {role.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4">
                      <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {role.slug}
                      </code>
                    </td>

                    {/* Permissions summary */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <KeyRound className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {permissionCount}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {permissionCount === 1 ? "permission" : "permissions"}
                          </span>
                        </div>
                        {permissionCount > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            {samplePermissions.map((label, idx) => (
                              <span
                                key={idx}
                                className="inline-flex max-w-[130px] truncate rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {label}
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <span className="inline-flex rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                +{remainingCount} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleSystemBadge isSystem={role.isSystem} />
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleStatusBadge isActive={role.isActive} />
                    </td>

                    {/* Created By */}
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                        <span>{getActorName(role.createdBy)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(role)}
                          disabled={role.isSystem}
                          title={
                            role.isSystem
                              ? "System roles cannot be deactivated"
                              : role.isActive
                              ? "Deactivate Role"
                              : "Activate Role"
                          }
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                            role.isActive
                              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                          <Power className="h-3.5 w-3.5" />
                          <span>{role.isActive ? "Deactivate" : "Activate"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(role)}
                          title="Edit Role"
                          className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(role)}
                          disabled={role.isSystem}
                          title={
                            role.isSystem
                              ? "System roles cannot be deleted"
                              : "Delete Role"
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-400 dark:hover:bg-red-900/60 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="mx-auto flex max-w-xs flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <Shield className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      No roles match your search
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
