'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { googleLogin } from '../services';
import { GoogleLoginResponse, GoogleLoginRequest } from '../types';

export const useGoogleLoginMutation = (): UseMutationResult<
  GoogleLoginResponse,
  Error,
  GoogleLoginRequest
> => {
  return useMutation<GoogleLoginResponse, Error, GoogleLoginRequest>({
    mutationFn: googleLogin,
  });
};

export default useGoogleLoginMutation;
