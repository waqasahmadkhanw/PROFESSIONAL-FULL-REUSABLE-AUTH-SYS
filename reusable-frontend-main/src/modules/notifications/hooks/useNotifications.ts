"use client";

import {
  useDeleteNotificationMutation,
  useMarkAllReadMutation,
  useMarkAsReadMutation,
  useSendNotificationMutation,
} from "../mutations";
import { useNotificationsQuery, useUnreadCountQuery } from "../queries";
import type { NotificationQueryParams } from "../types";

/**
 * Convenience hook for the notifications management page.
 *
 * Bundles the notifications list + unread count queries and the
 * mutation helpers so page components stay decoupled from
 * react-query internals.
 */
export const useNotifications = (params?: NotificationQueryParams) => {
  const query = useNotificationsQuery(params);
  const unreadQuery = useUnreadCountQuery();
  const sendMutation = useSendNotificationMutation();
  const markAllReadMutation = useMarkAllReadMutation();
  const markAsReadMutation = useMarkAsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    unreadCount: unreadQuery.data?.unreadCount ?? 0,
    send: sendMutation.mutateAsync,
    markAllRead: markAllReadMutation.mutateAsync,
    markAsRead: markAsReadMutation.mutateAsync,
    deleteNotification: deleteMutation.mutateAsync,
    isMutating:
      sendMutation.isPending ||
      markAllReadMutation.isPending ||
      markAsReadMutation.isPending ||
      deleteMutation.isPending,
  };
};

export default useNotifications;
