"use client";

import { useRefundPaymentMutation } from "../mutations";
import { usePaymentByIdQuery, usePaymentsQuery } from "../queries";
import type { PaymentQueryParams, RefundPayload } from "../types";

/**
 * Convenience hook exposing payment list query + mutations.
 */
export const usePayments = (params?: PaymentQueryParams) => {
  const query = usePaymentsQuery(params);
  const refundMutation = useRefundPaymentMutation();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    refundPayment: (id: string, payload?: RefundPayload) =>
      refundMutation.mutateAsync({ id, payload }),
    isRefunding: refundMutation.isPending,
  };
};

export default usePayments;
