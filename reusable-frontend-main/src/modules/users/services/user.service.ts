import {
  userApi,
} from "../api";
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
 * User Service
 *
 * Orchestrates data access for user management. Keeps the
 * data-fetching concern separate from the UI layer.
 */
export const userService = {
  list: (params?: UserQueryParams): Promise<UsersListResponse> =>
    userApi.getUsers(params),

  byId: (id: string): Promise<AdminUser> => userApi.getUserById(id),

  create: (data: CreateUserRequest): Promise<AdminUser> =>
    userApi.create(data),

  update: (id: string, data: UpdateUserRequest): Promise<AdminUser> =>
    userApi.update(id, data),

  remove: (id: string): Promise<null> => userApi.remove(id),

  changeRole: (
    id: string,
    role: ChangeRoleRequest["role"]
  ): Promise<ChangeRoleResponse> => userApi.changeRole(id, { role }),

  toggleActivation: (id: string): Promise<ToggleActivationResponse> =>
    userApi.toggleActivation(id),

} as const;
