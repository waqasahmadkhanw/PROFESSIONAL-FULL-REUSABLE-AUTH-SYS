'use client';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { getPublicSettingsApi } from '../api';
export const usePublicSettingsQuery=()=>useQuery({queryKey:QUERY_KEYS.SETTINGS.PUBLIC,queryFn:getPublicSettingsApi,staleTime:5*60*1000});
