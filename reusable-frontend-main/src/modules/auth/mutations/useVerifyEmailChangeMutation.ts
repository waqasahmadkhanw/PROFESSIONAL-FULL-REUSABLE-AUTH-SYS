'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { verifyEmailChange } from '../services';
import { VerifyEmailChangeResponse, VerifyEmailChangeRequest } from '../types';

export const useVerifyEmailChangeMutation = (): UseMutationResult<
  VerifyEmailChangeResponse,
  Error,
  VerifyEmailChangeRequest
> => {
  return useMutation<VerifyEmailChangeResponse, Error, VerifyEmailChangeRequest>({
    mutationFn: verifyEmailChange,
  });
};

export default useVerifyEmailChangeMutation;
