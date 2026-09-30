/**
 * Centralized TanStack Query cache keys.
 *
 * Keep server-state identities here so mutations can invalidate predictable
 * cache branches without duplicating string literals throughout the app.
 */
export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ["auth", "current-user"] as const,
    SESSION: ["auth", "session"] as const,
  },
  PROFILE: {
    CURRENT: ["profile", "current"] as const,
  },
  USERS: {
    ALL: ["users"] as const,
    LIST: (params?: Record<string, unknown>) => ["users", "list", params] as const,
    DETAILS: (id: string) => ["users", "details", id] as const,
  },
  ROLES: {
    ALL: ["roles"] as const,
    LIST: (params?: Record<string, unknown>) => ["roles", "list", params] as const,
    DETAILS: (id: string) => ["roles", "details", id] as const,
    PERMISSIONS: ["roles", "permissions"] as const,
    USER_PERMISSIONS: (id: string) => ["roles", "user-permissions", id] as const,
  },
  NOTIFICATIONS: {
    ALL: ["notifications"] as const,
    LIST: (params?: Record<string, unknown>) => ["notifications", "list", params] as const,
    UNREAD_COUNT: ["notifications", "unread-count"] as const,
  },
  MEDIA: {
    ALL: ["media"] as const,
    LIST: (params?: Record<string, unknown>) => ["media", "list", params] as const,
    DETAILS: (id: string) => ["media", "details", id] as const,
  },
  PAYMENTS: {
    ALL: ["payments"] as const,
    LIST: (params?: Record<string, unknown>) => ["payments", "list", params] as const,
    DETAILS: (id: string) => ["payments", "details", id] as const,
    ME: ["payments", "me"] as const,
    ME_LIST: (params?: Record<string, unknown>) => ["payments", "me", params] as const,
  },
  SETTINGS: {
    ALL: ["settings"] as const,
    LIST: (params?: Record<string, unknown>) => ["settings", "list", params] as const,
    PUBLIC: ["settings", "public"] as const,
    KEY: (key: string) => ["settings", "key", key] as const,
    DETAILS: (id: string) => ["settings", "details", id] as const,
  },
  ANNOUNCEMENTS: { ALL: ["announcements"] as const, LIST: (params?: Record<string, unknown>) => ["announcements", "list", params] as const, DETAILS: (id: string) => ["announcements", "details", id] as const },
  EVENTS: { ALL: ["events"] as const, LIST: (params?: Record<string, unknown>) => ["events", "list", params] as const, DETAILS: (id: string) => ["events", "details", id] as const },
  COUPONS: { ALL: ["coupons"] as const, LIST: (params?: Record<string, unknown>) => ["coupons", "list", params] as const, DETAILS: (id: string) => ["coupons", "details", id] as const },
  ORDERS: { ALL: ["orders"] as const, ME: ["orders", "me"] as const, LIST: (params?: Record<string, unknown>) => ["orders", "list", params] as const, DETAILS: (id: string) => ["orders", "details", id] as const },
  AUDIT_LOGS: {
    ALL: ["audit-logs"] as const,
    LIST: (params?: Record<string, unknown>) => ["audit-logs", "list", params] as const,
    STATS: ["audit-logs", "stats"] as const,
    DETAILS: (id: string) => ["audit-logs", "details", id] as const,
  },
} as const;

export default QUERY_KEYS;
