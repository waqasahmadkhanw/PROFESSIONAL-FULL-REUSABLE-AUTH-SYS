import { HTMLAttributes } from "react";

type Variant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-slate-100 text-slate-800 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80",
  warning: "bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80",
  danger: "bg-red-50 text-red-800 border border-red-200/80 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/80",
  info: "bg-sky-50 text-sky-800 border border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
