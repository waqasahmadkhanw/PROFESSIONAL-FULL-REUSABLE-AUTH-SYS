"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { refundPaymentApi } from "../api";
import { createIdempotencyKey } from "@/shared/api";
import type { RefundPayload } from "../types";

/**
 * Refund a completed payment (admin).
 */
export const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, idempotencyKey }: { id: string; payload?: RefundPayload; idempotencyKey?: string }) =>
      refundPaymentApi(id, payload, idempotencyKey ?? createIdempotencyKey("refund")),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PAYMENTS.ALL,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ME });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ME_LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ME });
    },
  });
};
