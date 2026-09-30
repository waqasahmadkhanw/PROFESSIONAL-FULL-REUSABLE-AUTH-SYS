"use client";

import { Check, Eye, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { NotificationReadBadge, NotificationTypeBadge } from ".";
import type { AppNotification } from "../types";

interface NotificationsTableProps {
  notifications: AppNotification[];
  onView: (notification: AppNotification) => void;
  onMarkRead: (id: string) => void;
  onDelete: (notification: AppNotification) => void;
}

export function NotificationsTable({
  notifications,
  onView,
  onMarkRead,
  onDelete,
}: NotificationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Notification</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {notifications.map((notification) => (
            <tr
              key={notification._id}
              onClick={() => onView(notification)}
              className="cursor-pointer transition-colors hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <p
                  className={`text-slate-900 ${
                    !notification.isRead ? "font-semibold" : "font-medium"
                  }`}
                >
                  {notification.title}
                </p>
                {notification.message && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {notification.message}
                  </p>
                )}
              </td>
              <td className="px-4 py-3">
                <NotificationTypeBadge type={notification.type} />
              </td>
              <td className="px-4 py-3">
                <NotificationReadBadge isRead={notification.isRead} />
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(notification.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkRead(notification._id);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(notification);
                    }}
                    aria-label="View"
                    className="inline-flex items-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification);
                    }}
                    aria-label="Delete"
                    className="inline-flex items-center rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
