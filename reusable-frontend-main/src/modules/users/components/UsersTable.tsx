import { Avatar } from "@/shared/components/ui";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/shared/components/ui/Dropdown";
import { Edit3, MoreHorizontal, Power, Trash2, ShieldCheck } from "lucide-react";
import type { AdminUser } from "../types";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

interface UsersTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onToggleActivation: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onManageAccess: (user: AdminUser) => void;
}

export function UsersTable({ users, onEdit, onToggleActivation, onDelete, onManageAccess }: UsersTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
            <th className="w-12 px-6 py-3.5"><span className="sr-only">Select user</span><span className="block h-4 w-4 rounded border border-slate-300 bg-white dark:border-white/20 dark:bg-slate-900" /></th>
            <th className="px-3 py-3.5">User</th><th className="px-4 py-3.5">Role</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Joined</th><th className="px-6 py-3.5 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {users.map((user) => <tr key={user._id} className="group transition-colors hover:bg-violet-50/50 dark:hover:bg-violet-500/[0.05]">
              <td className="px-6 py-4"><span className="block h-4 w-4 rounded border border-slate-300 bg-white transition-colors group-hover:border-violet-400 dark:border-white/20 dark:bg-slate-900" /></td>
              <td className="px-3 py-4"><UserIdentity user={user} /></td><td className="px-4 py-4"><UserRoleBadge role={user.role} /></td><td className="px-4 py-4"><UserStatusBadge isActivated={user.isActivated} /></td><td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{formatDate(user.createdAt)}</td>
              <td className="px-6 py-4 text-right"><UserActions user={user} onEdit={onEdit} onToggleActivation={onToggleActivation} onDelete={onDelete} onManageAccess={onManageAccess} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-4 lg:hidden">
        {users.map((user) => <article key={user._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex items-start justify-between gap-3"><UserIdentity user={user} /><UserActions user={user} onEdit={onEdit} onToggleActivation={onToggleActivation} onDelete={onDelete} onManageAccess={onManageAccess} /></div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs dark:border-white/10"><div><p className="mb-1 text-slate-500 dark:text-slate-400">Role</p><UserRoleBadge role={user.role} /></div><div><p className="mb-1 text-slate-500 dark:text-slate-400">Status</p><UserStatusBadge isActivated={user.isActivated} /></div><div className="col-span-2"><p className="mb-0.5 text-slate-500 dark:text-slate-400">Joined</p><p className="font-medium text-slate-700 dark:text-slate-200">{formatDate(user.createdAt)}</p></div></div>
        </article>)}
      </div>
    </>
  );
}

function UserIdentity({ user }: { user: AdminUser }) {
  return <div className="flex min-w-0 items-center gap-3"><Avatar src={user.avatar} alt={user.name} name={user.name} size="md" className="shrink-0 ring-2 ring-violet-100 dark:ring-violet-500/20" /><div className="min-w-0"><p className="truncate font-semibold text-slate-900 dark:text-white">{user.name}</p><p className="truncate text-sm text-slate-500 dark:text-slate-400">{user.email}</p></div></div>;
}

function UserActions({ user, onEdit, onToggleActivation, onDelete, onManageAccess }: { user: AdminUser; onEdit: (user: AdminUser) => void; onToggleActivation: (user: AdminUser) => void; onDelete: (user: AdminUser) => void; onManageAccess: (user: AdminUser) => void }) {
  return <Dropdown><DropdownTrigger asChild><button type="button" aria-label={`Actions for ${user.name}`} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-violet-400/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-200"><MoreHorizontal className="h-4 w-4" /></button></DropdownTrigger><DropdownContent align="end" className="min-w-[176px] rounded-xl border-slate-200 p-1.5 shadow-xl dark:border-white/10"><DropdownItem onSelect={() => onManageAccess(user)}><ShieldCheck className="mr-2 h-4 w-4 text-violet-500" />Access & permissions</DropdownItem><DropdownItem onSelect={() => onEdit(user)}><Edit3 className="mr-2 h-4 w-4 text-violet-500" />Edit user</DropdownItem><DropdownItem onSelect={() => onToggleActivation(user)}><Power className="mr-2 h-4 w-4 text-slate-500" />{user.isActivated ? "Deactivate user" : "Activate user"}</DropdownItem><DropdownSeparator /><DropdownItem onSelect={() => onDelete(user)} className="text-red-600 hover:!bg-red-50 hover:!text-red-700 dark:text-red-400 dark:hover:!bg-red-500/10 dark:hover:!text-red-300"><Trash2 className="mr-2 h-4 w-4" />Delete user</DropdownItem></DropdownContent></Dropdown>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
