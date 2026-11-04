"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { paymentService } from "../services";
export const useMyPaymentsQuery = (params?: { page?: number; limit?: number }) => {
  const stableParams = useMemo(() => ({ page: params?.page ?? 1, limit: params?.limit ?? 10 }), [params?.page, params?.limit]);
  return useQuery({ queryKey: QUERY_KEYS.PAYMENTS.ME_LIST(stableParams), queryFn: () => paymentService.myPayments(stableParams), staleTime: 30000 });
};
