// ============================================
// Payments Management Types (aligned with /api/payments)
// ============================================

/** Minimal populated customer reference. */
export interface PaymentCustomer {
  _id: string;
  name: string;
  email: string;
}

export interface PaymentItem {
  itemId: string;
  itemType: string;
  itemName: string;
  amount: number;
  quantity: number;
}

/** Minimal populated order reference. */
export interface PaymentOrder {
  _id: string;
  orderNumber: string;
}

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type PaymentMethod = "stripe" | "easypaisa" | "jazzcash" | "free" | "other" | string;

/** Core payment document (matches Payment model). */
export interface Payment {
  _id: string;
  customer: string | PaymentCustomer;
  items: PaymentItem[];
  order?: string | PaymentOrder | null;
  coupon?: string | null;
  couponCode?: string;
  subtotal: number;
  discount: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  refundId?: string;
  refundAmount?: number;
  refundedAt?: string | null;
  refundReason?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  easypaisaTransactionId?: string;
  easypaisaOrderReference?: string;
  jazzcashTxnRefNo?: string;
  jazzcashBillReference?: string;
  jazzcashMerchantId?: string;
  paidAt?: string | null;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/** Paginated list response for GET /api/payments. */
export interface PaymentListResult {
  payments: Payment[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

/** Query params for payment list (pagination/status/search/filter). */
export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  paymentMethod?: string;
  customer?: string;
  order?: string;
  from?: string;
  to?: string;
  [key: string]: unknown;
}

/** Payload for refunding a payment. */
export interface RefundPayload {
  reason?: string;
}

