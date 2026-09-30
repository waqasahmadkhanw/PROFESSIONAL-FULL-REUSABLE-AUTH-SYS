export type PaymentProvider = "stripe" | "easypaisa" | "jazzcash";

export interface CreatePaymentRequest {
  provider?: PaymentProvider;
  orderId: string;
  couponCode?: string;
  mobileNumber?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentSession {
  id?: string;
  paymentId?: string;
  transactionId?: string;
  provider?: PaymentProvider;
  status: "pending" | "processing" | "paid" | "failed" | "cancelled" | "refunded" | string;
  redirectUrl?: string;
  checkoutUrl?: string;
}
