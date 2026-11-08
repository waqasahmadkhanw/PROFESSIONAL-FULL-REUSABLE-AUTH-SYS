'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { activeSessions } from '../services';
import { ActiveSessionsResponse } from '../types';

export const useActiveSessionsMutation = (): UseMutationResult<
  ActiveSessionsResponse,
  Error,
  void
> => {
  return useMutation<ActiveSessionsResponse, Error, void>({
    mutationFn: activeSessions,
  });
};

export default useActiveSessionsMutation;
