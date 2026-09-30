'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { logout } from '../services';
import type { LogoutResponse } from '../types';

/**
 * Logout Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useLogout()
 *   ↓
 * useLogoutMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useLogoutMutation = (): UseMutationResult<
  LogoutResponse,
  Error,
  void
> => {
  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logout as () => Promise<LogoutResponse>,
  });
};

export default useLogoutMutation;