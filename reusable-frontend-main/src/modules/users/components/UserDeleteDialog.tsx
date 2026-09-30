"use client";

import { ConfirmDialog } from "@/shared/components/overlay";
import type { AdminUser } from "../types";

interface UserDeleteDialogProps {
  user: AdminUser | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (user: AdminUser) => void;
}

/**
 * Confirmation dialog shown before permanently deleting a user.
 */
export function UserDeleteDialog({
  user,
  isSubmitting,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(user)}
      onOpenChange={onClose}
      title="Delete User"
      description={`Are you sure you want to delete ${user?.name ?? "this user"}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      loading={isSubmitting}
      destructive
      onConfirm={() => user && onConfirm(user)}
    />
  );
}

