'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { orderApi } from '../api';
export const useCancelOrderMutation=()=>{const qc=useQueryClient();return useMutation({mutationFn:(id:string)=>orderApi.cancel(id),onSuccess:()=>{qc.invalidateQueries({queryKey:QUERY_KEYS.ORDERS.ALL});qc.invalidateQueries({queryKey:QUERY_KEYS.ORDERS.ME});}})};
