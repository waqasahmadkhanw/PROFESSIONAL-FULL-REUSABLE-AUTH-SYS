import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "Nothing here",
  description = "No data available.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {icon}

      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}