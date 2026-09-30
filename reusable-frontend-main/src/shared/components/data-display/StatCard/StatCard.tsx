import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  accent?: "indigo" | "emerald" | "amber" | "red" | "sky" | "slate";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/30",
  emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/30",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30",
  red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-400/30",
  sky: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-400/30",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-500/15 dark:text-slate-200 dark:ring-slate-400/30",
};

export function StatCard({
  title,
  value,
  icon,
  accent = "indigo",
}: StatCardProps) {
  return (
    <div className="metric-glow page-shell rounded-3xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        {icon && (
          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              ${accentClasses[accent]}
            `}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
