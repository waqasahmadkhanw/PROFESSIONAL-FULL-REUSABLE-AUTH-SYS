'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { deactivateAccount } from '../services';
import { DeactivateAccountResponse, DeactivateAccountRequest } from '../types';

export const useDeactivateAccountMutation = (): UseMutationResult<
  DeactivateAccountResponse,
  Error,
  DeactivateAccountRequest
> => {
  return useMutation<DeactivateAccountResponse, Error, DeactivateAccountRequest>({
    mutationFn: deactivateAccount,
  });
};

export default useDeactivateAccountMutation;
