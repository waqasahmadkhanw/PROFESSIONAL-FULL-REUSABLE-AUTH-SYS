"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-lg text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          404 Error
        </span>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Go Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </section>
    </main>
  );
}