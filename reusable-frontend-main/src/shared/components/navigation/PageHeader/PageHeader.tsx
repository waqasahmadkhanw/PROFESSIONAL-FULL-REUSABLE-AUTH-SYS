import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="page-shell mb-6 flex flex-col gap-4 rounded-3xl px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300/80">Overview</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}