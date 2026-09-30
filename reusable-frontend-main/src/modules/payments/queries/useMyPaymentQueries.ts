"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { paymentService } from "../services";
export const useMyPaymentsQuery = (params?: { page?: number; limit?: number }) => useQuery({ queryKey: QUERY_KEYS.PAYMENTS.ME_LIST(params), queryFn:()=>paymentService.myPayments(params) });
