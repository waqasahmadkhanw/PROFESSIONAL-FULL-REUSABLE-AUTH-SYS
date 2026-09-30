import apiClient from "@/shared/api/client";

import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type {
  Payment,
  PaymentListResult,
  PaymentQueryParams,
  RefundPayload,
} from "../types";

/**
 * GET /api/payments — paginated when supported, otherwise normalize the backend array response.
 */
export const getPaymentsApi = async (
  params?: PaymentQueryParams
): Promise<PaymentListResult> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.PAYMENTS.LIST, { params });
  const payload = result as { payments?: Payment[]; pagination?: PaymentListResult["pagination"] } | Payment[];

  if (Array.isArray(payload)) {
    const limit = (params?.limit ?? payload.length) || 1;
    const page = params?.page ?? 1;
    return {
      payments: payload,
      pagination: { total: payload.length, page, pages: Math.max(1, Math.ceil(payload.length / limit)) },
    };
  }

  return {
    payments: payload.payments ?? [],
    pagination: payload.pagination ?? { total: 0, page: 1, pages: 1 },
  };
};

/**
 * GET /api/payments/:id — single payment.
 */
export const getPaymentByIdApi = async (id: string): Promise<Payment> => {
  return apiClient.get<Payment>(API_ENDPOINTS.PAYMENTS.DETAILS(id));
};

/**
 * POST /api/payments/:id/refund — refund a completed payment (admin).
 */
export const refundPaymentApi = async (
  id: string,
  payload?: RefundPayload,
  idempotencyKey?: string,
): Promise<Payment> => {
  return apiClient.post<Payment>(API_ENDPOINTS.PAYMENTS.REFUND(id), payload, {
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  });
};

export const paymentApi = {
  getPayments: getPaymentsApi,
  getPaymentById: getPaymentByIdApi,
  refund: refundPaymentApi,
} as const;
