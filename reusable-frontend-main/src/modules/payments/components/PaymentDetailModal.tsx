"use client";
import { getApiErrorMessage } from "@/shared/api/errorMessage";

import React, { useState } from "react";
import { RotateCcw, CreditCard, User, Package, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Modal } from "@/shared/components/overlay/Modal";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { usePayments } from "../hooks";
import { PaymentMethodBadge, PaymentStatusBadge } from "./PaymentStatusBadge";
import type { Payment } from "../types";

interface PaymentDetailModalProps {
  payment: Payment | null;
  onClose: () => void;
}

function getCustomerName(customer: string | { name?: string; email?: string }): string {
  if (typeof customer === "string") return "—";
  return customer?.name ?? customer?.email ?? "—";
}

function getCustomerEmail(customer: string | { name?: string; email?: string }): string {
  if (typeof customer === "string") return "—";
  return customer?.email ?? "—";
}

function getItemTitle(items: Payment["items"]): string {
  return items?.[0]?.itemName ?? "—";
}

function formatDate(date?: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-none">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right text-xs font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

/**
 * Payment detail modal with refund action (admin).
 */
export function PaymentDetailModal({ payment, onClose }: PaymentDetailModalProps) {
  const { refundPayment } = usePayments();
  const toast = useToast();
  const [refundReason, setRefundReason] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);

  if (!payment) return null;

  const canRefund = payment.status === "completed";

  const handleRefund = async () => {
    setIsRefunding(true);
    try {
      await refundPayment(payment._id, { reason: refundReason || undefined });
      toast.success("Payment refunded successfully");
      onClose();
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to refund payment.");
      toast.error(message);
    } finally {
      setIsRefunding(false);
    }
  };

  const customerName = getCustomerName(payment.customer);
  const customerEmail = getCustomerEmail(payment.customer);

  return (
    <Modal open={Boolean(payment)} onOpenChange={onClose} title="Payment Ledger Details" size="lg">
      <div className="space-y-5">
        {/* Header Hero */}
        <div className="relative flex items-center justify-between rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 p-5 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-100 dark:border-violet-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                Transaction ID
              </p>
              <h3 className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                #{payment._id.toUpperCase()}
              </h3>
            </div>
          </div>

          <PaymentStatusBadge status={payment.status} />
        </div>

        {/* Customer & Item Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <User className="h-3.5 w-3.5 text-violet-500" />
              <span>Payer Details</span>
            </div>
            <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white truncate">
              {customerName}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{customerEmail}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Package className="h-3.5 w-3.5 text-indigo-500" />
              <span>Purchased Item</span>
            </div>
            <p className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
              {getItemTitle(payment.items)}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Ref: {payment.order ? "Order Linked" : "Direct Checkout"}
            </p>
          </div>
        </div>

        {/* Payment Ledger Breakdown */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Financial Ledger Summary
          </h4>
          <Row label="Subtotal" value={`$${Number(payment.subtotal || payment.amount || 0).toLocaleString()}`} />
          <Row label="Discount" value={`-$${Number(payment.discount || 0).toLocaleString()}`} />
          <Row
            label="Total Amount Paid"
            value={
              <span className="text-sm font-black text-violet-600 dark:text-violet-400">
                ${Number(payment.amount || 0).toLocaleString()} {payment.currency?.toUpperCase()}
              </span>
            }
          />
          <Row label="Payment Gateway" value={<PaymentMethodBadge method={payment.paymentMethod} />} />
          <Row label="Paid Timestamp" value={formatDate(payment.paidAt ?? payment.createdAt)} />
          {payment.refundedAt && <Row label="Refunded At" value={formatDate(payment.refundedAt)} />}
          {payment.refundReason && <Row label="Refund Reason" value={payment.refundReason} />}
        </div>

        {/* Refund Action Box */}
        {canRefund && (
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold">
              <ShieldAlert className="h-4 w-4" />
              <span>Refund Management</span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              Refunding will reverse the transaction and update the payment record to refunded status.
            </p>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={2}
              placeholder="Enter reason for refund..."
              className="w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 dark:border-rose-900 dark:bg-slate-900 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
            />
            <div className="flex justify-end">
              <Button
                variant="danger"
                size="sm"
                onClick={handleRefund}
                disabled={isRefunding}
                className="rounded-xl font-bold"
              >
                <RotateCcw className={`h-3.5 w-3.5 mr-1.5 ${isRefunding ? "animate-spin" : ""}`} />
                {isRefunding ? "Processing Refund..." : "Issue Full Refund"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

