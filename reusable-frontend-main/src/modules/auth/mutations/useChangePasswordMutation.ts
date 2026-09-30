'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { changePassword } from '../services';
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../types';

/**
 * Change Password Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useChangePassword()
 *   ↓
 * useChangePasswordMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useChangePasswordMutation = (): UseMutationResult<
  ChangePasswordResponse,
  Error,
  ChangePasswordRequest
> => {
  return useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordRequest
  >({
    mutationFn: changePassword as (data: ChangePasswordRequest) => Promise<ChangePasswordResponse>,
  });
};

export default useChangePasswordMutation;