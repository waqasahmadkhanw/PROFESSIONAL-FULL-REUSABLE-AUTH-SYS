import { notificationApi } from "../api";
import type {
  AppNotification,
  NotificationListResult,
  NotificationQueryParams,
  SendNotificationRequest,
  UnreadCountResult,
} from "../types";

/**
 * Notifications Service
 *
 * Orchestrates data access for notification management. Keeps the
 * data-fetching concern separate from the UI layer.
 */
export const notificationService = {
  send: (data: SendNotificationRequest): Promise<AppNotification | { count: number }> =>
    notificationApi.send(data),

  list: (params?: NotificationQueryParams): Promise<NotificationListResult> =>
    notificationApi.getNotifications(params),

  unreadCount: (): Promise<UnreadCountResult> =>
    notificationApi.getUnreadCount(),

  markAllRead: (): Promise<null> => notificationApi.markAllRead(),

  markAsRead: (id: string): Promise<AppNotification> =>
    notificationApi.markAsRead(id),

  delete: (id: string): Promise<null> => notificationApi.delete(id),
} as const;
