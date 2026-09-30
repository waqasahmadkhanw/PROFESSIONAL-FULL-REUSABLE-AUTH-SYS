import { paymentApi, createPaymentSessionApi, getMyPaymentsApi, createEasyPaisaCheckoutApi, createJazzCashCheckoutApi } from "../api";
import type { PaymentQueryParams, RefundPayload } from "../types";
import type { CreatePaymentSessionRequest, EasyPaisaCheckoutRequest, JazzCashCheckoutRequest } from "../api/payment.checkout.api";

export const paymentService = {
  list: (params?: PaymentQueryParams) => paymentApi.getPayments(params),
  getById: (id: string) => paymentApi.getPaymentById(id),
  refund: (id: string, payload?: RefundPayload, idempotencyKey?: string) => paymentApi.refund(id, payload, idempotencyKey),
  checkout: (data: CreatePaymentSessionRequest, idempotencyKey?: string) => createPaymentSessionApi(data, idempotencyKey),
  myPayments: (params?: { page?: number; limit?: number }) => getMyPaymentsApi(params),
  easypaisaCheckout: (data: EasyPaisaCheckoutRequest, idempotencyKey?: string) => createEasyPaisaCheckoutApi(data, idempotencyKey),
  jazzcashCheckout: (data: JazzCashCheckoutRequest, idempotencyKey?: string) => createJazzCashCheckoutApi(data, idempotencyKey),
} as const;
