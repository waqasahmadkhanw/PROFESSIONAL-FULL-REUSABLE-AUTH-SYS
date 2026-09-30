"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  RefreshCw,
  Search,
  CreditCard,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface PaymentsHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  methodFilter: string;
  setMethodFilter: (m: string) => void;
  isRefetching: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export function PaymentsHeader({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  isRefetching,
  onRefresh,
  onExport,
}: PaymentsHeaderProps) {
  const hasActiveFilters = searchQuery || statusFilter || methodFilter;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setMethodFilter("");
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link
          href="/admin"
          className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">
          Payments
        </span>
      </nav>

      {/* Title & Top Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Payments Management
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50">
              <CreditCard className="h-3 w-3" />
              Real-Time Ledger
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Monitor, filter, inspect, and issue refunds across all customer transactions.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefetching}
            className="rounded-xl border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 text-slate-500 dark:text-slate-400 ${
                isRefetching ? "animate-spin text-violet-600" : ""
              }`}
            />
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>

          <Button
            size="sm"
            onClick={onExport}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-xs font-semibold transition-all duration-150"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Payment ID, Customer Name, Email or Item..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 pl-9 pr-8 py-2 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="relative flex items-center">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="">All Gateway Methods</option>
              <option value="stripe">Stripe</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-xl bg-rose-50 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
