import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Session Expired",
  description: "Your session has expired. Please sign in again.",
};

export default function SessionExpiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white text-slate-900 p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Session Expired
        </h1>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Your session has expired for security reasons. Please sign in again to
          continue.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Sign In Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Go to Home
          </Link>
        </div>
      </section>
    </main>
  );
}