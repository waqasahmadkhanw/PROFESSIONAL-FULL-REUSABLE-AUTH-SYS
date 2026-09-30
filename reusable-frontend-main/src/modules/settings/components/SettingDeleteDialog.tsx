"use client";

import { ConfirmDialog } from "@/shared/components/overlay";
import type { Setting } from "../types";

interface SettingDeleteDialogProps {
  open: boolean;
  setting: Setting | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation dialog for deleting a setting.
 */
export function SettingDeleteDialog({
  open,
  setting,
  isDeleting,
  onClose,
  onConfirm,
}: SettingDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      title="Delete setting"
      description={`Are you sure you want to delete "${setting?.key ?? ""}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      destructive
      loading={isDeleting}
      onConfirm={onConfirm}
/>
  );
}
