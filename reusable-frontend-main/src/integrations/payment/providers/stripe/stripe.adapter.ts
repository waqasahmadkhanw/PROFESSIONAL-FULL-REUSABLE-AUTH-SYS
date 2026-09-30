import { paymentGateway } from "../../payment.gateway";
import type { PaymentSession } from "../../payment.types";

export const stripeAdapter = {
  createCheckout: (orderId: string, returnUrl?: string, cancelUrl?: string): Promise<PaymentSession> =>
    paymentGateway.createSession({ provider: "stripe", orderId, returnUrl, cancelUrl }),
};
