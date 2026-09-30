'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { updateProfile } from '../services';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../types';

/**
 * Update Profile Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useUpdateProfile()
 *   ↓
 * useUpdateProfileMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useUpdateProfileMutation = (): UseMutationResult<
  UpdateProfileResponse,
  Error,
  UpdateProfileRequest
> => {
  return useMutation<
    UpdateProfileResponse,
    Error,
    UpdateProfileRequest
  >({
    mutationFn: updateProfile as (data: UpdateProfileRequest) => Promise<UpdateProfileResponse>,
  });
};

export default useUpdateProfileMutation;