import { roleApi } from "../api";
import type {
  AssignUserPermissionsRequest,
  CreateRoleRequest,
  Role,
  RoleListResult,
  RoleQueryParams,
  UpdateRoleRequest,
  UserPermissionsResult,
} from "../types";

/**
 * Role Service
 *
 * Orchestrates data access for role & permission management.
 * Keeps the data-fetching concern separate from the UI layer.
 */
export const roleService = {
  list: (params?: RoleQueryParams): Promise<RoleListResult> =>
    roleApi.getRoles(params),

  allPermissions: (): Promise<string[]> => roleApi.getAllPermissions(),

  byId: (id: string): Promise<Role> => roleApi.getRoleById(id),

  create: (data: CreateRoleRequest): Promise<Role> => roleApi.create(data),

  update: (
    id: string,
    data: UpdateRoleRequest
  ): Promise<Role> => roleApi.update(id, data),

  remove: (id: string): Promise<null> => roleApi.remove(id),

  toggleStatus: (id: string): Promise<Role> => roleApi.toggleStatus(id),

  assignUserPermissions: (
    userId: string,
    data: AssignUserPermissionsRequest
  ): Promise<UserPermissionsResult> =>
    roleApi.assignUserPermissions(userId, data),

  getUserPermissions: (userId: string): Promise<UserPermissionsResult> =>
    roleApi.getUserPermissions(userId),
} as const;

