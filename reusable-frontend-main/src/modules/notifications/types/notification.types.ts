// ============================================
// Notifications Management Types (aligned with /api/notifications)
// ============================================

export type NotificationType = string;
export type NotificationRole = string;

/** Core notification document (matches Notification model). */
export interface AppNotification {
  _id: string;
  user: string | null;
  role?: NotificationRole | null;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  refModel?: string;
  refId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** List result for GET /api/notifications. */
export interface NotificationListResult {
  notifications: AppNotification[];
  total: number;
  unreadCount: number;
  currentPage: number;
  totalPages: number;
}

/** Query params for notification list. */
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unread?: boolean;
  [key: string]: unknown;
}

/** Payload for admin sending a notification. */
export interface SendNotificationRequest {
  userId?: string;
  role?: NotificationRole;
  type?: NotificationType;
  title: string;
  message?: string;
  link?: string;
}

/** Unread count result. */
export interface UnreadCountResult {
  unreadCount: number;
}
