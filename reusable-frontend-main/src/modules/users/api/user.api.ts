import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type {
  AdminUser,
  ChangeRoleRequest,
  ChangeRoleResponse,
  CreateUserRequest,
  ToggleActivationResponse,
  UpdateUserRequest,
  UserQueryParams,
  UsersListResponse,
} from "../types";

/**
 * GET /api/users — paginated, searchable user list.
 */
export const getUsersApi = async (
  params?: UserQueryParams
): Promise<UsersListResponse> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.USERS.LIST, { params });
  if (result && typeof result === "object" && "users" in result) {
    const payload = result as { users: AdminUser[]; pagination?: { total?: number; page?: number; pages?: number } };
    return {
      users: payload.users ?? [],
      totalUsers: payload.pagination?.total ?? payload.users?.length ?? 0,
      currentPage: payload.pagination?.page ?? params?.page ?? 1,
      totalPages: payload.pagination?.pages ?? 1,
    };
  }
  return { users: [], totalUsers: 0, currentPage: params?.page ?? 1, totalPages: 1 };
};

/**
 * GET /api/users/:id — single user.
 */
export const getUserByIdApi = async (
  id: string
): Promise<AdminUser> => {
  return apiClient.get<AdminUser>(API_ENDPOINTS.USERS.DETAILS(id));
};

/**
 * POST /api/users — create a user.
 */
export const createUserApi = async (
  data: CreateUserRequest
): Promise<AdminUser> => {
  return apiClient.post<AdminUser>(API_ENDPOINTS.USERS.CREATE, data);
};

/**
 * PATCH /api/users/:id — update a user.
 */
export const updateUserApi = async (
  id: string,
  data: UpdateUserRequest
): Promise<AdminUser> => {
  return apiClient.patch<AdminUser>(API_ENDPOINTS.USERS.UPDATE(id), data);
};

/**
 * DELETE /api/users/:id — delete a user.
 */
export const deleteUserApi = async (
  id: string
): Promise<null> => {
  return apiClient.delete<null>(API_ENDPOINTS.USERS.DELETE(id));
};

/**
 * PATCH /api/users/:id/role — change a user's role.
 */
export const changeUserRoleApi = async (
  id: string,
  data: ChangeRoleRequest
): Promise<ChangeRoleResponse> => {
  return apiClient.patch<ChangeRoleResponse>(
    API_ENDPOINTS.USERS.CHANGE_ROLE(id),
    data
  );
};

/**
 * PATCH /api/users/:id/activation — toggle user activation.
 */
export const toggleUserActivationApi = async (
  id: string
): Promise<ToggleActivationResponse> => {
  return apiClient.patch<ToggleActivationResponse>(
    API_ENDPOINTS.USERS.TOGGLE_ACTIVATE(id)
  );
};

export const userApi = {
  getUsers: getUsersApi,
  getUserById: getUserByIdApi,
  create: createUserApi,
  update: updateUserApi,
  remove: deleteUserApi,
  changeRole: changeUserRoleApi,
  toggleActivation: toggleUserActivationApi,
} as const;
