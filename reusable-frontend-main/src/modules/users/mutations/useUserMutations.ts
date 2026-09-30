"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { AUTH_QUERY_KEYS } from "@/modules/auth/constants/auth.query-keys";
import {
  changeUserRoleApi,
  createUserApi,
  deleteUserApi,
  toggleUserActivationApi,
  updateUserApi,
} from "../api";
import type {
  ChangeRoleRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types";

/**
 * Create a user (admin).
 */
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUserApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
};

/**
 * Update a user (admin).
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
};

/**
 * Delete a user (admin).
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
};

/**
 * Change a user's role (admin).
 */
export const useChangeUserRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: ChangeRoleRequest["role"] }) =>
      changeUserRoleApi(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.CURRENT_USER });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.PERMISSIONS });
    },
  });
};

/**
 * Toggle a user's activation (admin).
 */
export const useToggleUserActivationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleUserActivationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
};
