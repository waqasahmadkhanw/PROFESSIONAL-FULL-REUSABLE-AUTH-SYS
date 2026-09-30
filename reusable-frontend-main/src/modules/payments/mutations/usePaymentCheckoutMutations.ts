"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { createIdempotencyKey } from "@/shared/api";
import { paymentService } from "../services";
import type { CreatePaymentSessionRequest, EasyPaisaCheckoutRequest, JazzCashCheckoutRequest } from "../api/payment.checkout.api";

const refreshPayments = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ME });
  qc.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ME_LIST() });
};

export const usePaymentCheckoutMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreatePaymentSessionRequest; idempotencyKey?: string }) =>
      paymentService.checkout(data, idempotencyKey ?? createIdempotencyKey("stripe_checkout")),
    onSuccess: () => refreshPayments(qc),
  });
};

export const useEasyPaisaCheckoutMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: EasyPaisaCheckoutRequest; idempotencyKey?: string }) =>
      paymentService.easypaisaCheckout(data, idempotencyKey ?? createIdempotencyKey("easypaisa_checkout")),
    onSuccess: () => refreshPayments(qc),
  });
};

export const useJazzCashCheckoutMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: JazzCashCheckoutRequest; idempotencyKey?: string }) =>
      paymentService.jazzcashCheckout(data, idempotencyKey ?? createIdempotencyKey("jazzcash_checkout")),
    onSuccess: () => refreshPayments(qc),
  });
};
