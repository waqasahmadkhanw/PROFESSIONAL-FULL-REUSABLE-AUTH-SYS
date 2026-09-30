'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { forgotPassword } from '../services';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '../types';

/**
 * Forgot Password Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useForgotPassword()
 *   ↓
 * useForgotPasswordMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useForgotPasswordMutation = (): UseMutationResult<
  ForgotPasswordResponse,
  Error,
  ForgotPasswordRequest
> => {
  return useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,
  });
};

export default useForgotPasswordMutation;