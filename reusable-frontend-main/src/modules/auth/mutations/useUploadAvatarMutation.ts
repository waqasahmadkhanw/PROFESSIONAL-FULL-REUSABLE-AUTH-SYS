'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { uploadAvatar } from '../services';
import type {
  UploadAvatarRequest,
  UploadAvatarResponse,
} from '../types';

/**
 * Upload Avatar Mutation
 *
 * Flow:
 * Component
 *   ↓
 * useUploadAvatar()
 *   ↓
 * useUploadAvatarMutation()
 *   ↓
 * auth.service.ts
 *   ↓
 * auth.api.ts
 *   ↓
 * Backend API
 */
export const useUploadAvatarMutation = (): UseMutationResult<
  UploadAvatarResponse,
  Error,
  UploadAvatarRequest
> => {
  return useMutation<
    UploadAvatarResponse,
    Error,
    UploadAvatarRequest
  >({
    mutationFn: uploadAvatar as (data: UploadAvatarRequest) => Promise<UploadAvatarResponse>,
  });
};

export default useUploadAvatarMutation;