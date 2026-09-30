import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { Payment, PaymentListResult } from "../types";

export interface CreatePaymentSessionRequest {
  orderId: string;
}

export interface EasyPaisaCheckoutRequest extends CreatePaymentSessionRequest {
  mobileNumber?: string;
}

export interface JazzCashCheckoutRequest extends CreatePaymentSessionRequest {
  mobileNumber?: string;
}

export interface StripeCheckoutResponse {
  paymentId: string;
  checkoutUrl: string;
}

export interface EasyPaisaCheckoutResponse {
  paymentId: string;
  redirectUrl: string;
  transactionId: string;
}

export interface JazzCashCheckoutResponse {
  paymentId: string;
  gatewayUrl: string;
  formFields: Record<string, string>;
  secureHash: string;
  transactionId: string;
}

const assertResponse = <T extends object>(
  value: unknown,
  required: (keyof T)[],
  message: string,
): T => {
  if (!value || typeof value !== "object") {
    throw new Error(message);
  }

  const record = value as Record<string, unknown>;

  if (required.some((key) => typeof record[key as string] !== "string")) {
    throw new Error(message);
  }

  return value as T;
};

export const createPaymentSessionApi = (
  data: CreatePaymentSessionRequest,
  idempotencyKey?: string,
): Promise<StripeCheckoutResponse> =>
  apiClient
    .post<unknown>(API_ENDPOINTS.PAYMENTS.STRIPE_CHECKOUT, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    })
    .then((value) =>
      assertResponse<StripeCheckoutResponse>(
        value,
        ["paymentId", "checkoutUrl"],
        "Invalid Stripe checkout response",
      ),
    );

export const getMyPaymentsApi = async (
  params?: { page?: number; limit?: number },
): Promise<PaymentListResult> => {
  const result = await apiClient.get<unknown>(API_ENDPOINTS.PAYMENTS.ME, { params });

  if (!result || typeof result !== "object") {
    throw new Error("Invalid payment history response");
  }

  const payload = result as Partial<PaymentListResult>;

  if (!Array.isArray(payload.payments) || !payload.pagination) {
    throw new Error("Invalid payment history response");
  }

  return {
    payments: payload.payments,
    pagination: payload.pagination,
  };
};

export const createEasyPaisaCheckoutApi = (
  data: EasyPaisaCheckoutRequest,
  idempotencyKey?: string,
): Promise<EasyPaisaCheckoutResponse> =>
  apiClient
    .post<unknown>(API_ENDPOINTS.PAYMENTS.EASYPAISA_CHECKOUT, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    })
    .then((value) =>
      assertResponse<EasyPaisaCheckoutResponse>(
        value,
        ["paymentId", "redirectUrl", "transactionId"],
        "Invalid EasyPaisa checkout response",
      ),
    );

export const createJazzCashCheckoutApi = (
  data: JazzCashCheckoutRequest,
  idempotencyKey?: string,
): Promise<JazzCashCheckoutResponse> =>
  apiClient
    .post<unknown>(API_ENDPOINTS.PAYMENTS.JAZZCASH_CHECKOUT, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    })
    .then((value) => {
      const response = assertResponse<JazzCashCheckoutResponse>(
        value,
        ["paymentId", "gatewayUrl", "secureHash", "transactionId"],
        "Invalid JazzCash checkout response",
      );

      if (!response.formFields || typeof response.formFields !== "object") {
        throw new Error("Invalid JazzCash form fields");
      }

      return response;
    });
