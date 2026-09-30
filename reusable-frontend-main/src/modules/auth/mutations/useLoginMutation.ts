'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { login } from '../services';
import { LoginRequest, LoginResponse } from '../types';

/**
 * Login Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useLogin()
 *   ↓
 * useLoginMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useLoginMutation = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginRequest
> => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
};

export default useLoginMutation;