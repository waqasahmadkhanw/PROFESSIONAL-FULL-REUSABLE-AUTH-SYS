'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { linkGoogle } from '../services';
import { LinkGoogleResponse, LinkGoogleRequest } from '../types';

export const useLinkGoogleMutation = (): UseMutationResult<
  LinkGoogleResponse,
  Error,
  LinkGoogleRequest
> => {
  return useMutation<LinkGoogleResponse, Error, LinkGoogleRequest>({
    mutationFn: linkGoogle,
  });
};

export default useLinkGoogleMutation;
