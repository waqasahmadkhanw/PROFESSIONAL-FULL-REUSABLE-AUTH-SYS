'use client';

import { useCallback } from 'react';

import { useUpdateProfileMutation } from '../mutations';
import type { UpdateProfilePayload } from '../types';

export const useUpdateProfile = () => {
  const mutation = useUpdateProfileMutation();

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    updateProfile,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useUpdateProfile;