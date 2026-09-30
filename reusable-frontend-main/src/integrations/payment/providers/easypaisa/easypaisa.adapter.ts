import { paymentGateway } from "../../payment.gateway";
import type { PaymentSession } from "../../payment.types";

export const easypaisaAdapter = {
  createCheckout: (orderId: string, returnUrl?: string, cancelUrl?: string): Promise<PaymentSession> =>
    paymentGateway.createSession({ provider: "easypaisa", orderId, returnUrl, cancelUrl }),
};
