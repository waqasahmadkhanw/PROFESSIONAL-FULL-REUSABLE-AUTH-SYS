import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type {
  AssignUserPermissionsRequest,
  CreateRoleRequest,
  Role,
  RoleListResult,
  RolePagination,
  RoleQueryParams,
  UpdateRoleRequest,
  UserPermissionsResult,
} from "../types";

/**
 * GET /api/roles — paginated role list.
 */
export const getRolesApi = async (
  params?: RoleQueryParams
): Promise<RoleListResult> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.ROLES.LIST, { params });
  if (result && typeof result === "object" && "roles" in result) {
    const payload = result as { roles?: Role[]; pagination?: RolePagination };
    return {
      roles: payload.roles ?? [],
      pagination: payload.pagination ?? { total: 0, page: params?.page ?? 1, pages: 1 },
    };
  }
  return { roles: [], pagination: { total: 0, page: params?.page ?? 1, pages: 1 } };
};

/**
 * GET /api/roles/permissions — the full permission registry.
 */
export const getAllPermissionsApi = async (): Promise<string[]> => {
  const res = await apiClient.get<unknown>(API_ENDPOINTS.ROLES.PERMISSIONS);
  if (Array.isArray(res)) return res as string[];
  if (res && typeof res === "object") {
    const obj = res as Record<string, unknown>;
    if (Array.isArray(obj.permissions)) return obj.permissions as string[];
    if (Array.isArray(obj.data)) return obj.data as string[];
  }
  return [];
};

/**
 * GET /api/roles/:id — single role.
 */
export const getRoleByIdApi = async (id: string): Promise<Role> => {
  return apiClient.get<Role>(API_ENDPOINTS.ROLES.DETAILS(id));
};

/**
 * POST /api/roles — create a role.
 */
export const createRoleApi = async (
  data: CreateRoleRequest
): Promise<Role> => {
  return apiClient.post<Role>(API_ENDPOINTS.ROLES.CREATE, data);
};

/**
 * PUT /api/roles/:id — update a role.
 */
export const updateRoleApi = async (
  id: string,
  data: UpdateRoleRequest
): Promise<Role> => {
  return apiClient.put<Role>(API_ENDPOINTS.ROLES.UPDATE(id), data);
};

/**
 * DELETE /api/roles/:id — delete a role.
 */
export const deleteRoleApi = async (id: string): Promise<null> => {
  return apiClient.delete<null>(API_ENDPOINTS.ROLES.DELETE(id));
};

/**
 * PATCH /api/roles/:id/toggle-status — toggle active state.
 */
export const toggleRoleStatusApi = async (id: string): Promise<Role> => {
  return apiClient.patch<Role>(API_ENDPOINTS.ROLES.TOGGLE_STATUS(id));
};

/**
 * PATCH /api/roles/users/:userId/permissions — assign permissions.
 */
export const assignUserPermissionsApi = async (
  userId: string,
  data: AssignUserPermissionsRequest
): Promise<UserPermissionsResult> => {
  return apiClient.patch<UserPermissionsResult>(
    API_ENDPOINTS.ROLES.ASSIGN_PERMISSIONS(userId),
    data
  );
};

/**
 * GET /api/roles/users/:userId/permissions — fetch user permissions.
 */
export const getUserPermissionsApi = async (
  userId: string
): Promise<UserPermissionsResult> => {
  return apiClient.get<UserPermissionsResult>(
    API_ENDPOINTS.ROLES.USER_PERMISSIONS(userId)
  );
};

export const roleApi = {
  getRoles: getRolesApi,
  getAllPermissions: getAllPermissionsApi,
  getRoleById: getRoleByIdApi,
  create: createRoleApi,
  update: updateRoleApi,
  remove: deleteRoleApi,
  toggleStatus: toggleRoleStatusApi,
  assignUserPermissions: assignUserPermissionsApi,
  getUserPermissions: getUserPermissionsApi,
} as const;

