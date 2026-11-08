'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { resendVerifyEmail } from '../services';
import { ResendVerifyEmailResponse, ResendVerifyEmailRequest } from '../types';

export const useResendVerifyEmailMutation = (): UseMutationResult<
  ResendVerifyEmailResponse,
  Error,
  ResendVerifyEmailRequest
> => {
  return useMutation<ResendVerifyEmailResponse, Error, ResendVerifyEmailRequest>({
    mutationFn: resendVerifyEmail,
  });
};

export default useResendVerifyEmailMutation;
