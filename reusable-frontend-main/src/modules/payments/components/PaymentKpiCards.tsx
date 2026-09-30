"use client";

import React from "react";
import { DollarSign, CheckCircle2, Clock, XCircle, RotateCcw, TrendingUp } from "lucide-react";
import type { Payment } from "../types";

interface PaymentKpiCardsProps {
  payments?: Payment[];
  isLoading?: boolean;
}

export function PaymentKpiCards({ payments = [], isLoading }: PaymentKpiCardsProps) {
  // Compute KPIs from dataset
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const completedCount = payments.filter((p) => p.status === "completed").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;
  const refundedCount = payments.filter((p) => p.status === "refunded").length;

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const refundedAmount = payments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + (p.refundAmount || p.amount || 0), 0);

  const totalPayments = payments.length;
  const successRate = totalPayments > 0 ? Math.round((completedCount / totalPayments) * 100) : 0;

  const cards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      badge: "Current page",
      badgeType: "positive" as const,
      subtext: `From ${completedCount} completed transactions`,
      icon: DollarSign,
      iconBg: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
      accentBorder: "group-hover:border-violet-500/30",
    },
    {
      title: "Successful Payments",
      value: completedCount.toLocaleString(),
      badge: `${successRate}% Success Rate`,
      badgeType: "positive" as const,
      subtext: `Processed successfully via gateways`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      accentBorder: "group-hover:border-emerald-500/30",
    },
    {
      title: "Pending Payments",
      value: pendingCount.toLocaleString(),
      badge: `$${pendingAmount.toLocaleString()} volume`,
      badgeType: "warning" as const,
      subtext: `Awaiting payment confirmation`,
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      accentBorder: "group-hover:border-amber-500/30",
    },
    {
      title: "Failed Payments",
      value: failedCount.toLocaleString(),
      badge: `${Math.round((failedCount / totalPayments) * 100)}% Failed`,
      badgeType: "danger" as const,
      subtext: `Declined or cancelled checkouts`,
      icon: XCircle,
      iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      accentBorder: "group-hover:border-rose-500/30",
    },
    {
      title: "Refunded Amount",
      value: `$${refundedAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      badge: `${refundedCount} Refunds`,
      badgeType: "info" as const,
      subtext: `Issued back to customer accounts`,
      icon: RotateCcw,
      iconBg: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
      accentBorder: "group-hover:border-sky-500/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 ${card.accentBorder}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${card.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {card.value}
              </span>

              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  card.badgeType === "positive"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : card.badgeType === "warning"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    : card.badgeType === "danger"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                    : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400"
                }`}
              >
                <TrendingUp className="h-3 w-3 shrink-0" />
                {card.badge}
              </span>
            </div>

            <p className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
