"use client";

import { useEffect } from "react";
import { logger } from "@/core/logging/logger";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error("Route application error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Something went wrong!</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please try again. If the problem continues, contact support.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

