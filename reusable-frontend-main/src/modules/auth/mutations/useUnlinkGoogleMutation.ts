'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { unlinkGoogle } from '../services';
import { UnlinkGoogleResponse, UnlinkGoogleRequest } from '../types';

export const useUnlinkGoogleMutation = (): UseMutationResult<
  UnlinkGoogleResponse,
  Error,
  UnlinkGoogleRequest
> => {
  return useMutation<UnlinkGoogleResponse, Error, UnlinkGoogleRequest>({
    mutationFn: unlinkGoogle,
  });
};

export default useUnlinkGoogleMutation;
