'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { revokeSession } from '../services';
import { RevokeSessionResponse, RevokeSessionRequest } from '../types';

export const useRevokeSessionMutation = (): UseMutationResult<
  RevokeSessionResponse,
  Error,
  RevokeSessionRequest
> => {
  return useMutation<RevokeSessionResponse, Error, RevokeSessionRequest>({
    mutationFn: revokeSession,
  });
};

export default useRevokeSessionMutation;
