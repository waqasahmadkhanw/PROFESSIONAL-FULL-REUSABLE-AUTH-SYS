"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getPaymentByIdApi, getPaymentsApi } from "../api";
import type { PaymentListResult, PaymentQueryParams } from "../types";

/**
 * Fetch paginated payment list (admin).
 */
export const usePaymentsQuery = (params?: PaymentQueryParams) => {
  return useQuery<PaymentListResult>({
    queryKey: QUERY_KEYS.PAYMENTS.LIST(params),
    queryFn: () => getPaymentsApi(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Fetch a single payment.
 */
export const usePaymentByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.DETAILS(id ?? ""),
    queryFn: () => getPaymentByIdApi(id!),
    enabled: Boolean(id),
  });
};
