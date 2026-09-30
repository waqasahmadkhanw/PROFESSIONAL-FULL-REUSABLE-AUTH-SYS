/**
 * Generic application permission registry.
 * Keep this aligned with the reusable backend permission registry.
 * Domain-specific permissions belong to the application that consumes this template.
 */
export const PERMISSIONS = {
  READ_USERS: "read_users",
  CREATE_USERS: "create_users",
  UPDATE_USERS: "update_users",
  DELETE_USERS: "delete_users",
  MANAGE_ROLES: "manage_roles",
  MANAGE_PAYMENTS: "manage_payments",
  MANAGE_COUPONS: "manage_coupons",
  MANAGE_MEDIA: "manage_media",
  MANAGE_NOTIFICATIONS: "manage_notifications",
  MANAGE_ANNOUNCEMENTS: "manage_announcements",
  MANAGE_EVENTS: "manage_events",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_ACTIVITY_LOGS: "view_activity_logs",
  MANAGE_ACTIVITY_LOGS: "manage_activity_logs",
} as const;

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_LABELS: Record<string, string> = Object.fromEntries(
  ALL_PERMISSIONS.map((permission) => [
    permission,
    permission
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  ])
);

export default PERMISSIONS;
