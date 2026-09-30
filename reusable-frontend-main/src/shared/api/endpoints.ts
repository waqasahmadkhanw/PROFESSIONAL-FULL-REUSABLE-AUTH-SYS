/**
 * Browser-safe endpoint registry aligned with the reusable backend template.
 *
 * Webhooks/callbacks are intentionally absent: gateways call those directly.
 * Never place provider secrets in this file or in NEXT_PUBLIC_* variables.
 */
export const API_ENDPOINTS = {
  SECURITY: {
    CSRF: "/security/csrf",
  },
  AUTH: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    LOGOUT: "/user/logout",
    REFRESH_TOKEN: "/user/refresh-token",
    FORGOT_PASSWORD: "/user/forgot-password",
    RESET_PASSWORD: (token: string) => `/user/reset-password/${encodeURIComponent(token)}`,
    CHANGE_PASSWORD: "/user/password",
    CURRENT_USER: "/user/me",
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    AVATAR: "/profile/avatar",
    DELETE_AVATAR: "/user/avatar",
    SOCIALS: "/profile/socials",
    DELETE: "/profile/account",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    DETAILS: (id: string) => `/users/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/users/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/users/${encodeURIComponent(id)}`,
    CHANGE_ROLE: (id: string) => `/users/${encodeURIComponent(id)}/role`,
    TOGGLE_ACTIVATE: (id: string) => `/users/${encodeURIComponent(id)}/activation`,
  },
  ROLES: {
    LIST: "/roles",
    CREATE: "/roles",
    DETAILS: (id: string) => `/roles/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/roles/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/roles/${encodeURIComponent(id)}`,
    PERMISSIONS: "/roles/permissions",
    TOGGLE_STATUS: (id: string) => `/roles/${encodeURIComponent(id)}/toggle-status`,
    USER_PERMISSIONS: (userId: string) => `/roles/users/${encodeURIComponent(userId)}/permissions`,
    ASSIGN_PERMISSIONS: (userId: string) => `/roles/users/${encodeURIComponent(userId)}/permissions`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    SEND: "/notifications/send",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_ALL_READ: "/notifications/mark-all-read",
    MARK_READ: (id: string) => `/notifications/${encodeURIComponent(id)}/read`,
    DELETE: (id: string) => `/notifications/${encodeURIComponent(id)}`,
  },
  MEDIA: {
    LIST: "/media",
    UPLOAD: "/media",
    DETAILS: (id: string) => `/media/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/media/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/media/${encodeURIComponent(id)}`,
  },
  PAYMENTS: {
    STRIPE_CHECKOUT: "/payments/stripe/checkout",
    ME: "/payments/me",
    LIST: "/payments",
    DETAILS: (id: string) => `/payments/${encodeURIComponent(id)}`,
    REFUND: (id: string) => `/payments/${encodeURIComponent(id)}/refund`,
    EASYPAISA_CHECKOUT: "/payments/easypaisa/checkout",
    JAZZCASH_CHECKOUT: "/payments/jazzcash/checkout",
  },
  SETTINGS: {
    LIST: "/settings",
    CREATE: "/settings",
    BULK_UPDATE: "/settings/bulk",
    PUBLIC: "/settings/public",
    DETAILS: (id: string) => `/settings/${encodeURIComponent(id)}`,
    UPDATE: (id: string) => `/settings/${encodeURIComponent(id)}`,
    DELETE: (id: string) => `/settings/${encodeURIComponent(id)}`,
    BY_KEY: (key: string) => `/settings/key/${encodeURIComponent(key)}`,
  },
  ANNOUNCEMENTS: {
    LIST: "/announcements", CREATE: "/announcements", DETAILS: (id: string) => `/announcements/${encodeURIComponent(id)}`, UPDATE: (id: string) => `/announcements/${encodeURIComponent(id)}`, DELETE: (id: string) => `/announcements/${encodeURIComponent(id)}`, PIN: (id: string) => `/announcements/${encodeURIComponent(id)}/pin`, PUBLISH: (id: string) => `/announcements/${encodeURIComponent(id)}/publish`, ARCHIVE: (id: string) => `/announcements/${encodeURIComponent(id)}/archive`,
  },
  EVENTS: {
    LIST: "/events", CREATE: "/events", DETAILS: (id: string) => `/events/${encodeURIComponent(id)}`, UPDATE: (id: string) => `/events/${encodeURIComponent(id)}`, DELETE: (id: string) => `/events/${encodeURIComponent(id)}`, STATUS: (id: string) => `/events/${encodeURIComponent(id)}/status`,
  },
  COUPONS: {
    LIST: "/coupons", CREATE: "/coupons", DETAILS: (id: string) => `/coupons/${encodeURIComponent(id)}`, UPDATE: (id: string) => `/coupons/${encodeURIComponent(id)}`, DELETE: (id: string) => `/coupons/${encodeURIComponent(id)}`,
  },
  ORDERS: {
    ME: "/orders/me", LIST: "/orders", DETAILS: (id: string) => `/orders/${encodeURIComponent(id)}`, CANCEL: (id: string) => `/orders/${encodeURIComponent(id)}/cancel`,
  },
  AUDIT_LOGS: {
    LIST: "/audit-logs",
    STATS: "/audit-logs/stats",
    DETAILS: (id: string) => `/audit-logs/${encodeURIComponent(id)}`,
    CLEAR: "/audit-logs/clear",
    DELETE: (id: string) => `/audit-logs/${encodeURIComponent(id)}`,
  },
} as const;
