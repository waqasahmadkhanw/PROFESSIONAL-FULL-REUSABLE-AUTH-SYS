"use client";

import { useEffect } from "react";
import { env } from "@/shared/config/env";
import { logger } from "@/core/logging/logger";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    logger.error("Global application error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-6">
        <main className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-lg">
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Application Error
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                A critical error occurred while rendering the application.
              </p>
            </div>

            {env.IS_DEV && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                <p className="break-words font-mono text-sm text-red-600">
                  {error.message}
                </p>

                {error.digest && (
                  <p className="mt-2 text-xs text-gray-500">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-primary px-5 py-2 text-primary-foreground transition hover:opacity-90"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-border px-5 py-2 transition hover:bg-muted"
              >
                Reload App
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}