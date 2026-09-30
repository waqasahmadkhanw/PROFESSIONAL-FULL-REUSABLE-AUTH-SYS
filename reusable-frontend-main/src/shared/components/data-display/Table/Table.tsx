import { HTMLAttributes } from "react";

// Dark-theme table primitives, matching the app's glass-panel design
// system (dark Cards with light text). This used to hard-code a
// light-mode palette (white thead, slate-900 body text, slate-50
// hover) which rendered as an unstyled white block inside every
// dark Card that used it — e.g. the admin dashboard's Recent Users /
// Shared data tables used by feature modules.

export function Table({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full border-collapse text-slate-900 dark:text-slate-200 ${className}`}
        {...props}
      />
    </div>
  );
}

export function TableHead(
  props: HTMLAttributes<HTMLTableSectionElement>
) {
  return <thead className="bg-slate-100/80 dark:bg-white/5" {...props} />;
}

export function TableBody(
  props: HTMLAttributes<HTMLTableSectionElement>
) {
  return <tbody className="divide-y divide-slate-200 dark:divide-white/10" {...props} />;
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b border-slate-200 dark:border-white/10 transition-colors last:border-none hover:bg-slate-100/60 dark:hover:bg-white/5 ${className}`}
      {...props}
    />
  );
}

export function TableHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-400 ${className}`}
      {...props}
    />
  );
}

export function TableCell({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`px-4 py-3 text-sm text-slate-800 dark:text-slate-300 ${className}`}
      {...props}
    />
  );
}
