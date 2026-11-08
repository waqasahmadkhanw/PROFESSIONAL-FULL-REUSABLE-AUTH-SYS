'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { revokeAllExceptCurrent } from '../services';
import { RevokeAllExceptCurrentResponse, RevokeAllExceptCurrentRequest } from '../types';

export const useRevokeAllExceptCurrentMutation = (): UseMutationResult<
  RevokeAllExceptCurrentResponse,
  Error,
  RevokeAllExceptCurrentRequest
> => {
  return useMutation<RevokeAllExceptCurrentResponse, Error, RevokeAllExceptCurrentRequest>({
    mutationFn: revokeAllExceptCurrent,
  });
};

export default useRevokeAllExceptCurrentMutation;
