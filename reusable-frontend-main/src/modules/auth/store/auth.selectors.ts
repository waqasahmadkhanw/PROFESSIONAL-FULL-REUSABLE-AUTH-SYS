import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/shared/store";
import { hasPermission } from "../utils/auth.permission";

const selectAuthState = (state: RootState) => state.auth;

export const selectAuth = createSelector(
  [selectAuthState],
  (auth) => auth
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectUserId = createSelector(
  [selectAuthState],
  (auth) => auth.userId
);

export const selectRoles = createSelector(
  [selectAuthState],
  (auth) => auth.roles
);

export const selectPermissions = createSelector(
  [selectAuthState],
  (auth) => auth.permissions
);

export const selectAuthStatus = createSelector(
  [selectAuthState],
  (auth) => auth.status
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectHasRole = (role: string) =>
  createSelector([selectRoles], (roles) => roles.includes(role));

/**
 * Permission selector uses the same effective-permission rules as the rest
 * of the application. This prevents Redux consumers from having a second,
 * inconsistent authorization implementation.
 */
export const selectHasPermission = (permission: string) =>
  createSelector([selectAuthState], (auth) =>
    hasPermission(
      auth.userId && auth.roles.length
        ? {
            id: auth.userId,
            role: auth.roles[0],
            permissions: auth.permissions,
          }
        : null,
      permission
    )
  );
