import { paymentGateway } from "../../payment.gateway";
import type { PaymentSession } from "../../payment.types";

export const jazzcashAdapter = {
  createCheckout: (orderId: string, returnUrl?: string, cancelUrl?: string): Promise<PaymentSession> =>
    paymentGateway.createSession({ provider: "jazzcash", orderId, returnUrl, cancelUrl }),
};
