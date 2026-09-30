"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Plus,
  RefreshCw,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/Card";
import {
  Loading,
  ErrorState,
  EmptyState,
} from "@/shared/components/feedback";
import { Pagination } from "@/shared/components/navigation/Pagination";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useDebounce } from "@/shared/hooks";
import { useUsers } from "../hooks";
import { UsersTable } from "../components/UsersTable";
import { UserFormModal } from "../components/UserFormModal";
import { UserDeleteDialog } from "../components/UserDeleteDialog";
import { UserAccessModal } from "../components/UserAccessModal";
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types";

const PAGE_SIZE = 10;

/**
 * Users management page (admin).
 *
 * Lists paginated users, allows creating, editing, toggling
 * activation and deleting users via the generic `/api/users` backend.
 */
export function UsersPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | AdminUser["role"]>("");
  const [status, setStatus] = useState<"" | "true" | "false">("");
  const [sort, setSort] = useState("-createdAt");
  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    toggleActivation,
    isMutating,
  } = useUsers({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    role: role || undefined,
    isActivated: status || undefined,
    sort,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [accessUser, setAccessUser] = useState<AdminUser | null>(null);

  // These are intentionally based on the loaded page. The list API only
  // supplies a global total, not global role or active-status aggregates.
  const pageStats = useMemo(() => {
    const users = data?.users ?? [];
    return {
      active: users.filter((user) => user.isActivated).length,
      inactive: users.filter((user) => !user.isActivated).length,
    };
  }, [data?.users]);

  const hasFilters = Boolean(search || role || status || sort !== "-createdAt");

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setSort("-createdAt");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: {
    id?: string;
    data: CreateUserRequest | UpdateUserRequest;
  }) => {
    try {
      if (payload.id) {
        await updateUser({ id: payload.id, data: payload.data });
        toast.success("User updated successfully");
      } else {
        await createUser(payload.data as CreateUserRequest);
        toast.success("User created successfully");
      }
      setFormOpen(false);
      setEditingUser(null);
    } catch {
      toast.error("An error occurred while saving the user");
    }
  };

  const handleToggleActivation = async (user: AdminUser) => {
    try {
      await toggleActivation(user._id);
      toast.success(
        user.isActivated ? "User deactivated" : "User activated"
      );
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    try {
      await deleteUser(user._id);
      toast.success("User deleted successfully");
      setDeletingUser(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Dashboard</span><span className="text-slate-300 dark:text-slate-600">/</span><span className="text-violet-600 dark:text-violet-300">Users</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><UsersRound className="h-5 w-5" /></div>
            <div><h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Users</h1><p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Manage platform members, access and activation status.</p></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => refetch()}>Refresh</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Add User</Button>
        </div>
      </header>

      <section aria-label="User statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "Total users", value: data?.totalUsers ?? "—", accent: "bg-violet-500" },
          { label: "Active on this page", value: pageStats.active, accent: "bg-emerald-500" },
          { label: "Inactive on this page", value: pageStats.inactive, accent: "bg-amber-500" },
        ].map((stat) => (
          <div key={stat.label} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-900/70">
            <span className={`absolute left-0 top-0 h-full w-1 ${stat.accent}`} />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <div className="border-b border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-violet-400"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <label className="sr-only" htmlFor="user-role-filter">Filter by role</label>
              <div className="relative"><Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input id="user-role-filter" value={role} onChange={(event) => { setRole(event.target.value as AdminUser["role"]); setPage(1); }} placeholder="Role" className="h-10 w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/15 dark:bg-slate-950/40 dark:text-slate-200" /></div>
              <label className="sr-only" htmlFor="user-status-filter">Filter by status</label>
              <div className="relative"><select id="user-status-filter" value={status} onChange={(event) => { setStatus(event.target.value as "" | "true" | "false"); setPage(1); }} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-7 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/15 dark:bg-slate-950/40 dark:text-slate-200"><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /></div>
              <label className="sr-only" htmlFor="user-sort">Sort users</label>
              <div className="relative col-span-2 sm:col-span-1"><select id="user-sort" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-7 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/15 dark:bg-slate-950/40 dark:text-slate-200"><option value="-createdAt">Newest first</option><option value="createdAt">Oldest first</option><option value="name">Name A–Z</option><option value="-name">Name Z–A</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /></div>
              {hasFilters && <Button size="sm" variant="ghost" leftIcon={<X className="h-3.5 w-3.5" />} onClick={clearFilters}>Clear</Button>}
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <Loading message="Loading users..." />
          ) : isError ? (
<ErrorState
              title="Failed to load users"
              message={error?.message ?? "Please try again later."}
              onRetry={() => refetch()}
            />
          ) : data && data.users.length > 0 ? (
            <UsersTable
              users={data.users}
              onEdit={handleEdit}
              onToggleActivation={handleToggleActivation}
              onDelete={setDeletingUser} onManageAccess={setAccessUser}
            />
          ) : (
<EmptyState
              title="No users found"
              description={
                debouncedSearch
                  ? `No users match "${debouncedSearch}". Try a different search.`
                  : "Get started by adding your first user."
              }
            />
          )}
        </CardContent>

        {data && data.totalPages > 1 && (
        <CardFooter className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">Showing page {page} of {data.totalPages}</p>
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </CardFooter>
        )}
      </Card>

      <UserFormModal
        key={formOpen ? (editingUser?._id ?? "new") : "closed"}
        open={formOpen}
        user={editingUser}
        isSubmitting={isMutating}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
      />

      <UserAccessModal user={accessUser} open={Boolean(accessUser)} onClose={() => setAccessUser(null)} />

      <UserDeleteDialog
        user={deletingUser}
        isSubmitting={isMutating}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
