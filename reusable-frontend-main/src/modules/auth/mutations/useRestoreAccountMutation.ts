'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { restoreAccount } from '../services';
import { RestoreAccountResponse, RestoreAccountRequest } from '../types';

export const useRestoreAccountMutation = (): UseMutationResult<
  RestoreAccountResponse,
  Error,
  RestoreAccountRequest
> => {
  return useMutation<RestoreAccountResponse, Error, RestoreAccountRequest>({
    mutationFn: restoreAccount,
  });
};

export default useRestoreAccountMutation;
