'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { resetPassword } from '../services';
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types';

/**
 * Reset Password Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useResetPassword()
 *   ↓
 * useResetPasswordMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useResetPasswordMutation = (): UseMutationResult<
  ResetPasswordResponse,
  Error,
  ResetPasswordRequest
> => {
  return useMutation<
    ResetPasswordResponse,
    Error,
    ResetPasswordRequest
  >({
    mutationFn: resetPassword,
  });
};

export default useResetPasswordMutation;