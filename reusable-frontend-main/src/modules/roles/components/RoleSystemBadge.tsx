import React from "react";
import { Lock, Sliders } from "lucide-react";

interface RoleSystemBadgeProps {
  isSystem: boolean;
}

/**
  * Professional badge indicating whether a role is a system role or custom role.
  */
export function RoleSystemBadge({ isSystem }: RoleSystemBadgeProps) {
  return isSystem ? (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-500/30">
      <Lock className="h-3 w-3 text-indigo-500" />
      System
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
      <Sliders className="h-3 w-3 text-slate-500" />
      Custom
    </span>
  );
}

