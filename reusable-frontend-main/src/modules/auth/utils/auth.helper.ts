/**
 * ============================================================
 * Auth Helper Utilities
 * ============================================================
 * Pure utility functions.
 * No React.
 * No API calls.
 * No browser storage.
 * No business logic.
 * ============================================================
 */

import type { AuthUser } from "../types";

/**
 * Returns user's full name (the API stores a single display `name` field).
 */
export const getFullName = (name?: string): string => {
  return name?.trim() ?? "";
};

/**
 * Returns initials from a user's name.
 *
 * Example:
 * John Doe -> JD
 * John -> J
 */
export const getUserInitials = (name?: string): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";

  return `${first}${last}`.toUpperCase();
};

/**
 * Returns display name.
 *
 * Priority:
 * name
 * email
 */
export const getDisplayName = (
  user?: Partial<AuthUser> | null
): string => {
  if (!user) return "";
  return user.name || user.email || "";
};

/**
 * Returns avatar fallback text.
 */
export const getAvatarFallback = (
  user?: Partial<AuthUser> | null
): string => {
  if (!user) return "?";
  return getUserInitials(user.name) || user.email?.charAt(0).toUpperCase() || "?";
};

/**
 * Returns true if account is active.
 */
export const isAccountActive = (
  user?: Partial<AuthUser> | null
): boolean => {
  return Boolean(user?.isActivated);
};

/**
 * Safely compares user ids.
 */
export const isCurrentUser = (
  currentUserId?: string,
  targetUserId?: string
): boolean => {
  if (!currentUserId || !targetUserId) {
    return false;
  }

  return currentUserId === targetUserId;
};
