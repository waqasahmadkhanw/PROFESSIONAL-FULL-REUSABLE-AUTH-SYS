'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { changeEmail } from '../services';
import { ChangeEmailResponse, ChangeEmailRequest } from '../types';

export const useRequestEmailChangeMutation = (): UseMutationResult<
  ChangeEmailResponse,
  Error,
  ChangeEmailRequest
> => {
  return useMutation<ChangeEmailResponse, Error, ChangeEmailRequest>({
    mutationFn: changeEmail,
  });
};

export default useRequestEmailChangeMutation;
