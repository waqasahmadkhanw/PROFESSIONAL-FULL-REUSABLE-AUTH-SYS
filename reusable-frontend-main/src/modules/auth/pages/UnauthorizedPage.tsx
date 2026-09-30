import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "You are not authorized to access this page.",
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white text-slate-900 p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">401</h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
          Unauthorized
        </h2>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          You do not have permission to access this page.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium transition hover:bg-indigo-700"
          >
            Go Home
          </Link>

          <Link
            href="/login"
            className="rounded-md border border-slate-300 px-4 py-2 text-slate-800 font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}