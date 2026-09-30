'use client';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { profileApi } from '../api';
export const useProfileQuery = () => useQuery({ queryKey: QUERY_KEYS.PROFILE.CURRENT, queryFn: profileApi.get });
