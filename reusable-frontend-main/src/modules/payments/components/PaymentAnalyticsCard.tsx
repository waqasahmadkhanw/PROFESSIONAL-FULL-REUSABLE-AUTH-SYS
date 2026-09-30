"use client";

import React, { useState } from "react";
import { TrendingUp, PieChart, DollarSign } from "lucide-react";
import type { Payment } from "../types";

interface PaymentAnalyticsCardProps {
  payments?: Payment[];
  isLoading?: boolean;
}

export function PaymentAnalyticsCard({ payments = [], isLoading }: PaymentAnalyticsCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group payments by date (last 7 items)
  const groupedByDate = payments.reduce<Record<string, { date: string; amount: number; count: number }>>(
    (acc, p) => {
      const d = p.paidAt || p.createdAt;
      const dateStr = d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "N/A";
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, amount: 0, count: 0 };
      }
      if (p.status === "completed") {
        acc[dateStr].amount += p.amount || 0;
      }
      acc[dateStr].count += 1;
      return acc;
    },
    {}
  );

  const series = Object.values(groupedByDate).slice(0, 7);

  // Fallback if series is empty
  const chartSeries = series;
  const maxAmount = Math.max(...chartSeries.map((d) => d.amount), 100);

  // Calculate status counts
  const total = payments.length || 1;
  const completed = payments.filter((p) => p.status === "completed").length;
  const pending = payments.filter((p) => p.status === "pending").length;
  const failed = payments.filter((p) => p.status === "failed").length;
  const refunded = payments.filter((p) => p.status === "refunded").length;

  const points = chartSeries.map((d, i) => {
    const x = chartSeries.length > 1 ? (i / (chartSeries.length - 1)) * 500 : 250;
    const y = 140 - (d.amount / maxAmount) * 110;
    return { x, y, item: d };
  });

  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
  }, "");

  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x},140 L ${points[0].x},140 Z` : "";

  if (isLoading) {
    return (
      <div className="h-56 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50" />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Revenue Trend Chart */}
      <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Revenue Flow
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gross transaction volume across active checkout sessions.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <TrendingUp className="h-3 w-3" /> Live Dynamics
          </span>
        </div>

        <div className="relative mt-4">
          {hoveredIndex !== null && chartSeries[hoveredIndex] && (
            <div
              className="pointer-events-none absolute z-20 rounded-xl border border-slate-200/90 bg-white/95 p-2.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-150"
              style={{
                left: `${Math.min(
                  Math.max((hoveredIndex / Math.max(chartSeries.length - 1, 1)) * 80 + 5, 5),
                  75
                )}%`,
                top: "-10px",
              }}
            >
              <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                {chartSeries[hoveredIndex].date}
              </p>
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-0.5">
                ${chartSeries[hoveredIndex].amount.toLocaleString()} ({chartSeries[hoveredIndex].count} txns)
              </p>
            </div>
          )}

          <svg viewBox="0 0 500 150" className="w-full h-36 overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[20, 60, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="500"
                y2={y}
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800/60"
                strokeDasharray="4 4"
              />
            ))}

            {areaD && <path d={areaD} fill="url(#payGrad)" />}
            {pathD && <path d={pathD} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />}

            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? "5" : "3.5"}
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredIndex === i
                    ? "fill-violet-600 stroke-white dark:stroke-slate-900 stroke-2"
                    : "fill-white dark:fill-slate-900 stroke-violet-600 stroke-2"
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>

          <div className="mt-2 flex justify-between px-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {chartSeries.map((d, i) => (
              <span key={i}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Status Distribution */}
      <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Status Mix
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Payment outcome breakdown.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Completed</span>
                <span className="text-emerald-600 dark:text-emerald-400">{completed} ({Math.round((completed / total) * 100)}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div style={{ width: `${(completed / total) * 100}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Pending</span>
                <span className="text-amber-600 dark:text-amber-400">{pending} ({Math.round((pending / total) * 100)}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div style={{ width: `${(pending / total) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Failed</span>
                <span className="text-rose-600 dark:text-rose-400">{failed} ({Math.round((failed / total) * 100)}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div style={{ width: `${(failed / total) * 100}%` }} className="h-full bg-rose-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Refunded</span>
                <span className="text-sky-600 dark:text-sky-400">{refunded} ({Math.round((refunded / total) * 100)}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div style={{ width: `${(refunded / total) * 100}%` }} className="h-full bg-sky-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
