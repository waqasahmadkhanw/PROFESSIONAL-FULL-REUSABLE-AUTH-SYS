export type UserRole = string;

export interface RedirectOptions {
  callbackUrl?: string;
  defaultPath?: string;
}

export const getSafeCallbackUrl = (callbackUrl?: string): string | null => {
  if (!callbackUrl) return null;
  try {
    const decoded = decodeURIComponent(callbackUrl);
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\")) return null;
    return decoded;
  } catch {
    return null;
  }
};

export const getLoginRedirect = ({ callbackUrl, defaultPath = "/dashboard" }: RedirectOptions = {}) =>
  getSafeCallbackUrl(callbackUrl) ?? defaultPath;

/** Role-to-route mapping is intentionally configurable and contains no domain roles. */
export const getDashboardRedirect = (role?: UserRole): string => {
  const roleRoutes: Record<string, string> = {
    admin: "/dashboard",
    manager: "/dashboard",
    user: "/dashboard",
  };
  return role ? roleRoutes[role] ?? "/dashboard" : "/dashboard";
};

export const getLogoutRedirect = () => "/login";
export const getRegisterRedirect = () => "/login?registered=1";
export const getResetPasswordRedirect = () => "/login";
export const getUnauthorizedRedirect = () => "/403";
export const getUnauthenticatedRedirect = (callbackUrl?: string) =>
  callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
