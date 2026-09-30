"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Home,
  LogIn,
  RefreshCw,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function ForbiddenPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 750);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/50 px-4 py-12 dark:bg-slate-950">
      {/* Background ambient lighting blur effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-600/15" />

      <section className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl transition-all sm:p-10 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-2xl">
        {/* Top Decorative Graphic Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-xs ring-1 ring-rose-500/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>

        {/* Status Badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
          <Lock className="h-3 w-3" />
          <span>Error 403 — Access Denied</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Access Restricted
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          You don&apos;t have the necessary role permissions to access this page or resource. If you believe this is an error, please request elevated access from your organization admin.
        </p>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200/80 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>{isRefreshing ? "Checking..." : "Refresh"}</span>
          </button>
        </div>

        {/* Bottom Helper Note */}
        <div className="mt-8 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Need help? Contact system administration or visit the support portal.
        </div>
      </section>
    </main>
  );
}

