import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type {
  AppNotification,
  NotificationListResult,
  NotificationQueryParams,
  SendNotificationRequest,
  UnreadCountResult,
} from "../types";

/**
 * POST /api/notifications/send — send a notification (admin).
 */
export const sendNotificationApi = async (
  data: SendNotificationRequest
): Promise<AppNotification | { count: number }> => {
  return apiClient.post<AppNotification | { count: number }>(
    API_ENDPOINTS.NOTIFICATIONS.SEND,
    data
  );
};

/**
 * GET /api/notifications — current user's paginated notifications.
 */
export const getNotificationsApi = async (
  params?: NotificationQueryParams
): Promise<NotificationListResult> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
  const payload = result as {
    notifications?: AppNotification[];
    total?: number;
    unreadCount?: number;
    pagination?: { page?: number; pages?: number };
  };
  return {
    notifications: payload.notifications ?? [],
    total: payload.total ?? 0,
    unreadCount: payload.unreadCount ?? 0,
    currentPage: payload.pagination?.page ?? params?.page ?? 1,
    totalPages: payload.pagination?.pages ?? 1,
  };
};

/**
 * GET /api/notifications/unread-count — current user's unread count.
 */
export const getUnreadCountApi = async (): Promise<UnreadCountResult> => {
  const result = await apiClient.get<UnreadCountResult>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return { unreadCount: result?.unreadCount ?? 0 };
};

/**
 * PATCH /api/notifications/mark-all-read — mark all as read.
 */
export const markAllReadApi = async (): Promise<null> => {
  return apiClient.patch<null>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
};

/**
 * PATCH /api/notifications/:id/read — mark single as read.
 */
export const markAsReadApi = async (id: string): Promise<AppNotification> => {
  return apiClient.patch<AppNotification>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
  );
};

/**
 * DELETE /api/notifications/:id — delete a notification.
 */
export const deleteNotificationApi = async (id: string): Promise<null> => {
  return apiClient.delete<null>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
};

export const notificationApi = {
  send: sendNotificationApi,
  getNotifications: getNotificationsApi,
  getUnreadCount: getUnreadCountApi,
  markAllRead: markAllReadApi,
  markAsRead: markAsReadApi,
  delete: deleteNotificationApi,
} as const;
