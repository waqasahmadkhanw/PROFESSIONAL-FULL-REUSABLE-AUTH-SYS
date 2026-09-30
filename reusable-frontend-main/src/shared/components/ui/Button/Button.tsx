'use client';

import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from 'react';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

type Size =
  | 'sm'
  | 'md'
  | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'border border-indigo-400/40 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:brightness-110 focus-visible:ring-indigo-400',

  secondary:
    'border border-slate-300 bg-slate-100 text-slate-800 hover:border-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-indigo-400/40 dark:hover:bg-slate-800 dark:hover:text-white hover:shadow-md focus-visible:ring-indigo-400',

  outline:
    'border border-slate-300 bg-transparent text-slate-800 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 dark:border-white/15 dark:text-slate-100 dark:hover:border-indigo-400/60 dark:hover:bg-indigo-500/10 dark:hover:text-white focus-visible:ring-indigo-400',

  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white focus-visible:ring-indigo-400',

  danger:
    'border border-red-500/40 bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:brightness-110 focus-visible:ring-red-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          font-medium
          select-none
          cursor-pointer
          transition-all
          duration-200
          ease-out
          hover:-translate-y-0.5
          hover:scale-[1.01]
          active:translate-y-0
          active:scale-[0.98]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white
          dark:focus-visible:ring-offset-slate-950
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:pointer-events-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
            />
          </svg>
        )}

        {!loading && leftIcon}

        <span>{children}</span>

        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
