import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { CreatePaymentRequest, PaymentSession } from "./payment.types";

/**
 * Provider-independent browser facade.
 *
 * Provider secrets, webhook verification and signature generation stay on
 * the backend. The browser only asks the backend to start/inspect a payment.
 */
export const paymentGateway = {
  createSession: (payload: CreatePaymentRequest) => {
    const endpoint =
      payload.provider === "easypaisa"
        ? API_ENDPOINTS.PAYMENTS.EASYPAISA_CHECKOUT
        : payload.provider === "jazzcash"
          ? API_ENDPOINTS.PAYMENTS.JAZZCASH_CHECKOUT
          : API_ENDPOINTS.PAYMENTS.STRIPE_CHECKOUT;

    return apiClient.post<PaymentSession>(endpoint, payload);
  },

  getSession: (id: string) =>
    apiClient.get<PaymentSession>(API_ENDPOINTS.PAYMENTS.DETAILS(id)),
} as const;
