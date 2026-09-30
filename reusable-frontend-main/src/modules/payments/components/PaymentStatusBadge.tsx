"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, RotateCcw, CreditCard, DollarSign, Wallet } from "lucide-react";
import type { PaymentStatus, PaymentMethod } from "../types";

const statusConfig: Record<
  PaymentStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  completed: {
    label: "Completed",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/60",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    bg: "bg-rose-50 dark:bg-rose-950/60",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800/60",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    bg: "bg-sky-50 dark:bg-sky-950/60",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800/60",
    icon: RotateCcw,
  },
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  showIcon?: boolean;
}

export function PaymentStatusBadge({ status, showIcon = true }: PaymentStatusBadgeProps) {
  const cfg = statusConfig[status] ?? {
    label: status,
    bg: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    icon: Clock,
  };

  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span>{cfg.label}</span>
    </span>
  );
}

const methodConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  stripe: {
    label: "Stripe",
    bg: "bg-violet-50 dark:bg-violet-950/60",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800/60",
    icon: CreditCard,
  },
  easypaisa: {
    label: "EasyPaisa",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
    icon: Wallet,
  },
  jazzcash: {
    label: "JazzCash",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/60",
    icon: DollarSign,
  },
};

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const normalized = (method || "").toLowerCase();
  const cfg = methodConfig[normalized] ?? {
    label: method || "Card",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    icon: CreditCard,
  };

  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
}
