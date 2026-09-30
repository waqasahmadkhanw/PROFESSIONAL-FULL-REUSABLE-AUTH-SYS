export type UserRole = string;

export interface AuthUser {
  id: string;
  role?: UserRole;
  roles?: UserRole[];
  permissions?: string[];
}

const roleMatches = (user: AuthUser, role: string) =>
  user.role === role || Boolean(user.roles?.includes(role));

const effectivePermissions = (user: AuthUser | null | undefined): Set<string> =>
  new Set(user?.permissions ?? []);

export const hasRole = (user: AuthUser | null | undefined, role: UserRole) =>
  Boolean(user && roleMatches(user, role));

export const hasAnyRole = (user: AuthUser | null | undefined, roles: UserRole[]) =>
  Boolean(user && roles.some((role) => roleMatches(user, role)));

export const hasAllRoles = (user: AuthUser | null | undefined, roles: UserRole[]) =>
  Boolean(user && roles.every((role) => roleMatches(user, role)));

export const hasPermission = (user: AuthUser | null | undefined, permission: string) => {
  if (!user) return false;
  const permissions = effectivePermissions(user);
  return permissions.has("*") || permissions.has(permission);
};

export const hasAnyPermission = (user: AuthUser | null | undefined, permissions: string[]) =>
  permissions.some((permission) => hasPermission(user, permission));

export const hasAllPermissions = (user: AuthUser | null | undefined, permissions: string[]) =>
  permissions.every((permission) => hasPermission(user, permission));

export const canAccess = (
  user: AuthUser | null | undefined,
  options: { roles?: UserRole[]; permissions?: string[] },
) => Boolean(
  user &&
  (!options.roles?.length || hasAnyRole(user, options.roles)) &&
  (!options.permissions?.length || hasAllPermissions(user, options.permissions)),
);
