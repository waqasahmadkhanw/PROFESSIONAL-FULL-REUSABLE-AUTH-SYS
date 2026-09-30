"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { AUTH_QUERY_KEYS } from "@/modules/auth/constants/auth.query-keys";
import {
  assignUserPermissionsApi,
  createRoleApi,
  deleteRoleApi,
  toggleRoleStatusApi,
  updateRoleApi,
} from "../api";
import type {
  AssignUserPermissionsRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types";

/**
 * Create a role.
 */
export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRoleApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.ALL });
    },
  });
};

/**
 * Update a role.
 */
export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRoleRequest;
    }) => updateRoleApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.ALL });
    },
  });
};

/**
 * Delete a role.
 */
export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.ALL });
    },
  });
};

/**
 * Toggle role active status.
 */
export const useToggleRoleStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleRoleStatusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.ALL });
    },
  });
};

/**
 * Assign permissions to a user.
 */
export const useAssignUserPermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: AssignUserPermissionsRequest;
    }) => assignUserPermissionsApi(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles", "user-permissions"],
      });
      // If an administrator edits their own permissions, immediately refresh
      // the session-derived permission cache. This is harmless for other users
      // and prevents stale authorization UI.
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.CURRENT_USER });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.PERMISSIONS });
    },
  });
};

