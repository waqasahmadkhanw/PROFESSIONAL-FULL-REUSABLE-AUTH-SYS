"use client";

import React, { useState } from "react";
import {
  Eye,
  Package,
  Copy,
  Check,
} from "lucide-react";
import type { Payment } from "../types";
import { PaymentMethodBadge, PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentsTableProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

function getCustomerName(customer: string | { name?: string; email?: string }): string {
  if (typeof customer === "string") return "Customer";
  return customer?.name ?? customer?.email ?? "Customer";
}

function getCustomerEmail(customer: string | { name?: string; email?: string }): string {
  if (typeof customer === "string") return "—";
  return customer?.email ?? "—";
}

function getItemTitle(items: Payment["items"]): string {
  return items?.[0]?.itemName ?? "Item";
}

function formatDate(date?: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = (currency || "").toUpperCase() === "PKR" ? "₨" : "$";
  return `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function PaymentsTable({
  payments,
  onView,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}: PaymentsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isAllSelected =
    payments.length > 0 && payments.every((p) => selectedIds.includes(p._id));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded-md border-slate-300 text-violet-600 focus:ring-violet-500/20"
                />
              </th>
              <th className="p-4">Payment ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Item</th>
              <th className="p-4">Method</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Paid Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {payments.map((payment) => {
              const isSelected = selectedIds.includes(payment._id);
              const customerName = getCustomerName(payment.customer);
              const customerEmail = getCustomerEmail(payment.customer);
              const itemTitle = getItemTitle(payment.items);
              const formattedAmt = formatCurrency(payment.amount, payment.currency);
              const displayId = payment._id.slice(-8).toUpperCase();

              return (
                <tr
                  key={payment._id}
                  className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                    isSelected ? "bg-violet-50/40 dark:bg-violet-950/20" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(payment._id)}
                      className="rounded-md border-slate-300 text-violet-600 focus:ring-violet-500/20"
                    />
                  </td>

                  {/* Payment ID */}
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <span>#{displayId}</span>
                      <button
                        onClick={() => copyToClipboard(payment._id)}
                        className="text-slate-400 hover:text-violet-600 transition-colors"
                        title="Copy full transaction ID"
                      >
                        {copiedId === payment._id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 font-extrabold text-xs">
                        {customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {customerName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Item */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {itemTitle}
                      </span>
                    </div>
                  </td>

                  {/* Method */}
                  <td className="p-4">
                    <PaymentMethodBadge method={payment.paymentMethod} />
                  </td>

                  {/* Amount */}
                  <td className="p-4 font-black text-slate-900 dark:text-white">
                    {formattedAmt}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <PaymentStatusBadge status={payment.status} />
                  </td>

                  {/* Date */}
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onView(payment)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-3">
        {payments.map((payment) => {
          const customerName = getCustomerName(payment.customer);
          const customerEmail = getCustomerEmail(payment.customer);
          const itemTitle = getItemTitle(payment.items);
          const formattedAmt = formatCurrency(payment.amount, payment.currency);
          const displayId = payment._id.slice(-8).toUpperCase();

          return (
            <div
              key={payment._id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    #{displayId}
                  </span>
                  <PaymentStatusBadge status={payment.status} />
                </div>

                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {formattedAmt}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Customer</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{customerName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{customerEmail}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Item</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{itemTitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <PaymentMethodBadge method={payment.paymentMethod} />

                <button
                  onClick={() => onView(payment)}
                  className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Inspect
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
