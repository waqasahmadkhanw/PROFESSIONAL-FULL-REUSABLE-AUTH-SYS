"use client";
import { getApiErrorMessage } from "@/shared/api/errorMessage";

import { Button } from "@/shared/components/ui";
import { Modal } from "@/shared/components/overlay/Modal";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useNotifications } from "../hooks";
import type { AppNotification } from "../types";

interface NotificationDeleteDialogProps {
  notification: AppNotification | null;
  onClose: () => void;
}

/**
 * Delete confirmation dialog for a notification (admin).
 */
export function NotificationDeleteDialog({
  notification,
  onClose,
}: NotificationDeleteDialogProps) {
  const { deleteNotification, isMutating } = useNotifications();
  const toast = useToast();

  if (!notification) return null;

  const handleDelete = async () => {
    try {
      await deleteNotification(notification._id);
      toast.success("Notification deleted");
      onClose();
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to delete notification.");
      toast.error(message);
    }
  };

  return (
    <Modal
      open={Boolean(notification)}
      onOpenChange={onClose}
      title="Delete Notification"
    >
      <p className="text-sm text-slate-600">
        Are you sure you want to delete{" "}
        <span className="font-medium text-slate-900">{notification.title}</span>
        ? This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isMutating}>
          {isMutating ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
