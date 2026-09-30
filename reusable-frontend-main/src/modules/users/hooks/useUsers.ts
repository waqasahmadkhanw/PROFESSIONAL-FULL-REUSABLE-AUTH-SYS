"use client";

import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useToggleUserActivationMutation,
  useChangeUserRoleMutation,
  useUpdateUserMutation,
} from "../mutations";
import { useUsersQuery } from "../queries";
import type { UserQueryParams } from "../types";

/**
 * Convenience hook for the users management page.
 *
 * Bundles the users list query plus the mutation helpers so
 * page components stay decoupled from react-query internals.
 */
export const useUsers = (params?: UserQueryParams, enabled = true) => {
  const query = useUsersQuery(params, enabled);
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();
  const toggleActivationMutation = useToggleUserActivationMutation();
  const changeRoleMutation = useChangeUserRoleMutation();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    toggleActivation: toggleActivationMutation.mutateAsync,
    changeRole: changeRoleMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleActivationMutation.isPending ||
      changeRoleMutation.isPending,
  };
};

export default useUsers;

