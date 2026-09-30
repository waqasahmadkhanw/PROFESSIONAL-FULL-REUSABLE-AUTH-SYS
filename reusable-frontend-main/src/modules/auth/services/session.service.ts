/**
 * Session facade retained for compatibility. The real session is owned by
 * backend HttpOnly cookies; no authentication secret is written to storage.
 */
import type { AuthUser } from "../types";

let user: AuthUser | null = null;

export const sessionService = {
  isAuthenticated: () => Boolean(user),
  getUser: () => user,
  setUser: (nextUser: AuthUser) => { user = nextUser; },
  clearSession: () => { user = null; },
};

export default sessionService;
