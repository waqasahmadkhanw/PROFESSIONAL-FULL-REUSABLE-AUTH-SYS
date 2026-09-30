"use client";

import { Modal } from "@/shared/components/overlay/Modal";
import { NotificationReadBadge, NotificationTypeBadge } from ".";
import type { AppNotification } from "../types";

interface NotificationDetailModalProps {
  notification: AppNotification | null;
  onClose: () => void;
}

/**
 * Read-only detail view for a notification.
 */
export function NotificationDetailModal({
  notification,
  onClose,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const rows: { label: string; value: string }[] = [
    { label: "Title", value: notification.title },
    { label: "Type", value: notification.type },
    { label: "Message", value: notification.message || "—" },
    { label: "Link", value: notification.link || "—" },
    { label: "Created", value: new Date(notification.createdAt).toLocaleString() },
  ];

  return (
    <Modal
      open={Boolean(notification)}
      onOpenChange={onClose}
      title="Notification Details"
    >
      <div className="mb-4 flex items-center gap-2">
        <NotificationTypeBadge type={notification.type} />
        <NotificationReadBadge isRead={notification.isRead} />
      </div>

      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
