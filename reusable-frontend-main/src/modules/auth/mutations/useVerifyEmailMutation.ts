'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { verifyEmail } from '../services';
import { VerifyEmailResponse, VerifyEmailRequest } from '../types';

export const useVerifyEmailMutation = (): UseMutationResult<
  VerifyEmailResponse,
  Error,
  VerifyEmailRequest
> => {
  return useMutation<VerifyEmailResponse, Error, VerifyEmailRequest>({
    mutationFn: verifyEmail,
  });
};

export default useVerifyEmailMutation;
