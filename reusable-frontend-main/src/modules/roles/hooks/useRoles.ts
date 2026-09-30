"use client";

import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useToggleRoleStatusMutation,
  useUpdateRoleMutation,
} from "../mutations";
import { useAllPermissionsQuery, useRolesQuery } from "../queries";
import type { RoleQueryParams } from "../types";

/**
 * Convenience hook for role management + the permission registry.
 */
export const useRoles = (params?: RoleQueryParams) => {
  const query = useRolesQuery(params);
  const permissionsQuery = useAllPermissionsQuery();

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const deleteMutation = useDeleteRoleMutation();
  const toggleStatusMutation = useToggleRoleStatusMutation();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    permissions: permissionsQuery.data,
    permissionsLoading: permissionsQuery.isLoading,
    permissionsError: permissionsQuery.isError,
    createRole: createMutation.mutateAsync,
    updateRole: updateMutation.mutateAsync,
    deleteRole: deleteMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleStatusMutation.isPending,
  };
};

export default useRoles;

