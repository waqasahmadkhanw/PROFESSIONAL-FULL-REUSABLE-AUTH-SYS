import React from "react";

interface RoleStatusBadgeProps {
  isActive: boolean;
}

/**
  * Professional role active/inactive badge with dot indicator and dark mode support.
  */
export function RoleStatusBadge({ isActive }: RoleStatusBadgeProps) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/30">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800/80 dark:text-slate-400 dark:ring-slate-700">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactive
    </span>
  );
}

