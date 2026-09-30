'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { refreshToken } from '../services';
import type {
  RefreshTokenResponse,
} from '../types';

/**
 * Refresh Token Mutation
 *
 * Flow:
 * Component / Axios Interceptor
 *   ↓
 * useRefreshTokenMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useRefreshTokenMutation = (): UseMutationResult<
  RefreshTokenResponse,
  Error,
  void
> => {
  return useMutation<
    RefreshTokenResponse,
    Error,
    void,
    unknown
  >({
    mutationFn: refreshToken,
  });
};

export default useRefreshTokenMutation;