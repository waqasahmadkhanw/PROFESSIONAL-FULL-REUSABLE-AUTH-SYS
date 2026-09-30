'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { couponApi } from '../api';
import type { CouponPayload } from '../types';
export const useCreateCouponMutation=()=>{const qc=useQueryClient();return useMutation({mutationFn:(d:CouponPayload)=>couponApi.create(d),onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.COUPONS.ALL})});};
export const useUpdateCouponMutation=()=>{const qc=useQueryClient();return useMutation({mutationFn:({id,data}:{id:string;data:Partial<CouponPayload>})=>couponApi.update(id,data),onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.COUPONS.ALL})});};
export const useDeleteCouponMutation=()=>{const qc=useQueryClient();return useMutation({mutationFn:(id:string)=>couponApi.remove(id),onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.COUPONS.ALL})});};
