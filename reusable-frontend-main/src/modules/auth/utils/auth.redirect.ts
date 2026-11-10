export type UserRole = string;

export interface RedirectOptions {
  callbackUrl?: string;
  defaultPath?: string;
}

export const AUTH_ROLES = ["admin", "user", "teacher", "instructor"] as const;
export type KnownAuthRole = (typeof AUTH_ROLES)[number];

export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";
export const UNAUTHORIZED_PATH = "/403";

/** Single source of truth for role -> dashboard route mapping. */
export const DASHBOARD_ROUTES: Record<KnownAuthRole, string> = {
  admin: "/admin",
  user: "/dashboard",
  teacher: "/dashboard",
  instructor: "/dashboard",
};

export const isKnownAuthRole = (role?: string | null): role is KnownAuthRole =>
  Boolean(role && (AUTH_ROLES as readonly string[]).includes(role));

export const getSafeCallbackUrl = (callbackUrl?: string | null): string | null => {
  if (!callbackUrl) return null;
  try {
    const decoded = decodeURIComponent(callbackUrl);
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\")) return null;
    // Never preserve auth endpoints as post-auth destinations to avoid redirect loops/confusion.
    if (
      decoded === "/login" ||
      decoded.startsWith("/login?") ||
      decoded === "/register" ||
      decoded === "/forgot-password" ||
      decoded.startsWith("/reset-password") ||
      decoded === "/verify-email" ||
      decoded.startsWith("/verify-email?")
    ) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const getLoginRedirect = ({ callbackUrl, defaultPath = DEFAULT_AUTHENTICATED_PATH }: RedirectOptions = {}) =>
  getSafeCallbackUrl(callbackUrl) ?? defaultPath;

export const getUnauthorizedRedirect = () => UNAUTHORIZED_PATH;
export const getLogoutRedirect = () => "/login";
export const getRegisterRedirect = () => "/login?registered=1";
export const getResetPasswordRedirect = () => "/login";
export const getUnauthenticatedRedirect = (callbackUrl?: string | null) =>
  callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";

/** Resolves the dashboard path for a given role. Unknown/unauthorized roles fall back safely. */
export const getDashboardRoute = (role?: UserRole | null): string => {
  if (!role) return DEFAULT_AUTHENTICATED_PATH;
  return isKnownAuthRole(role) ? DASHBOARD_ROUTES[role] : DEFAULT_AUTHENTICATED_PATH;
};

/** Backwards-compatible alias; uses the same centralized mapping (no duplicate role logic). */
export const getDashboardRedirect = getDashboardRoute;

export const resolvePostAuthRedirect = (role?: UserRole | null, callbackUrl?: string | null): string =>
  getSafeCallbackUrl(callbackUrl) ?? getDashboardRoute(role);

export const resolvePostVerifyRedirect = (callbackUrl?: string | null): string => {
  const safeCallback = getSafeCallbackUrl(callbackUrl);
  return safeCallback ? `/login?verified=1&callbackUrl=${encodeURIComponent(safeCallback)}` : "/login?verified=1";
};
