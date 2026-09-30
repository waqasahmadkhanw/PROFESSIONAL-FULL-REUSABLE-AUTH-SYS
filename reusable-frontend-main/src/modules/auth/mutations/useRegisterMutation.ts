'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { register } from '../services';
import type { RegisterRequest, RegisterResponse } from '../types';

/**
 * Register Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useRegister()
 *   ↓
 * useRegisterMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useRegisterMutation = (): UseMutationResult<
  RegisterResponse,
  Error,
  RegisterRequest
> => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,
  });
};

export default useRegisterMutation;