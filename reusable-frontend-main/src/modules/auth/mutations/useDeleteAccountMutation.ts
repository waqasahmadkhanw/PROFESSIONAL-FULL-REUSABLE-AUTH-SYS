'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { deleteAccount } from '../services';
import { useAppDispatch } from '@/shared/store';
import { logout } from '../store';
import { clearCsrfToken } from '@/shared/api';
import { emitLocalAuthSync, publishAuthSync } from '../utils/auth.sync';
import type {
  DeleteAccountRequest,
  DeleteAccountResponse,
} from '../types';

/**
 * Delete Account Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useDeleteAccount()
 *   ↓
 * useDeleteAccountMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useDeleteAccountMutation = (): UseMutationResult<
  DeleteAccountResponse,
  Error,
  DeleteAccountRequest
> => {
  const dispatch = useAppDispatch();
  return useMutation<DeleteAccountResponse, Error, DeleteAccountRequest>({
    mutationFn: deleteAccount as (data: DeleteAccountRequest) => Promise<DeleteAccountResponse>,
    onSuccess: () => {
      clearCsrfToken();
      dispatch(logout());
      emitLocalAuthSync("logout");
      publishAuthSync("logout");
    },
  });
};

export default useDeleteAccountMutation;