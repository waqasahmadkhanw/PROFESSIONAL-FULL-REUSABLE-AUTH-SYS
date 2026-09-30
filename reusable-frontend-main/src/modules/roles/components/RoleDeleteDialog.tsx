"use client";

import { ConfirmDialog } from "@/shared/components/overlay";
import type { Role } from "../types";

interface RoleDeleteDialogProps {
  role: Role | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (role: Role) => void;
}

/**
 * Confirmation dialog before permanently deleting a role.
 * System roles cannot be deleted (handled upstream by disabling the action).
 */
export function RoleDeleteDialog({
  role,
  isSubmitting,
  onClose,
  onConfirm,
}: RoleDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(role)}
      onOpenChange={onClose}
      title="Delete Role"
      description={`Are you sure you want to delete the role "${role?.name ?? "this role"}"? Users assigned to it may lose their permissions. This cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      loading={isSubmitting}
      destructive
      onConfirm={() => role && onConfirm(role)}
    />
  );
}
