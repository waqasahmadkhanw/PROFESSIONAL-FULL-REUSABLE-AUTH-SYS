"use client";

import { BarChart3 } from "lucide-react";

/**
 * Generic dashboard shell.
 * Add application-specific widgets in the consuming project rather than
 * coupling the reusable template to a particular business domain.
 */
export function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generic application dashboard. Add domain-specific widgets here.
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        No application metrics are configured yet.
      </div>
    </section>
  );
}
