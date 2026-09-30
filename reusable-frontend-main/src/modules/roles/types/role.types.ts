/**
 * Roles & Permissions — Types
 * Mirrors the reusable backend role model and `/api/roles` response shapes.
 */

/** A user who created/updated a role (populated by backend). */
export interface RoleActor {
  _id: string;
  name: string;
  email: string;
}

/** A role managed by the admin. */
export interface Role {
  _id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  createdBy?: string | RoleActor;
  updatedBy?: string | RoleActor;
  createdAt?: string;
  updatedAt?: string;
}

/** Paginated role list payload from `GET /api/roles`. */
export interface RolePagination {
  total: number;
  page: number;
  pages: number;
}

/** Normalized roles list result exposed to the UI. */
export interface RoleListResult {
  roles: Role[];
  pagination: RolePagination;
}

/** Query params for the roles list endpoint. */
export interface RoleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

/** Payload for creating a role. */
export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

/** Payload for updating a role. */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

/** Payload for assigning permissions to a user. */
export interface AssignUserPermissionsRequest {
  permissions: string[];
}

/** Response from assigning/getting a user's permissions. */
export interface UserPermissionsResult {
  userId?: string;
  permissions: string[];
  // present when fetching via the GET endpoint (full user object)
  name?: string;
  email?: string;
  role?: string;
}

