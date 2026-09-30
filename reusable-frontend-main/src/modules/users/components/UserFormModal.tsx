"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui";
import { Modal } from "@/shared/components/overlay";
import { useRolesQuery } from "@/modules/roles/queries";
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
} from "../types";

interface UserFormModalProps {
  open: boolean;
  user: AdminUser | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    id?: string;
    data: CreateUserRequest | UpdateUserRequest;
  }) => void;
}

/**
 * Create/Edit user form modal. When `user` is present it
 * behaves as an edit form, otherwise it creates a new user.
 *
 * The form is remounted on every open via `key` so initial
 * state is derived directly from `user`, avoiding effects.
 */
export function UserFormModal({
  open,
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "");
  const { data: rolesData } = useRolesQuery({ page: 1, limit: 100 });
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isActivated, setIsActivated] = useState(
    user?.isActivated ?? true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSubmit({
        id: user._id,
        data: { name, email, phone, role, isActivated },
      });
    } else {
      onSubmit({
        data: { name, email, password, role, phone },
      });
    }
  };

  const labelClass = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";

  return (
    <Modal open={open} onOpenChange={onClose} title={user ? "Edit User" : "Add User"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Full name"
          />
        </div>

        <div>
          <label className={labelClass}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="user@example.com"
          />
        </div>

        {!user && (
          <div>
            <label className={labelClass}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Minimum 6 characters"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {user ? "Status" : "Role"}
            </label>
            {user ? (
              <select
                value={role}
                required
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={inputClass}
              >
                <option value="" disabled>Select role</option>
                {(rolesData?.roles ?? []).map((item) => (
                  <option key={item._id} value={item.slug}>{item.name}</option>
                ))}
              </select>
            ) : (
              <select
                value={role}
                required
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={inputClass}
              >
                <option value="" disabled>Select role</option>
                {(rolesData?.roles ?? []).map((item) => (
                  <option key={item._id} value={item.slug}>{item.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="Optional phone number"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {user ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
