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
    'bg-primary text-white border border-transparent hover:bg-primary/90 focus-visible:ring-primary/40 active:bg-primary-hover',

  secondary:
    'bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-border-strong focus-visible:ring-primary/40 active:bg-surface-elevated dark:bg-surface-elevated dark:hover:bg-surface-hover',

  outline:
    'bg-transparent text-primary border border-primary/30 hover:bg-primary/5 focus-visible:ring-primary/40 active:bg-primary/10',

  ghost:
    'bg-transparent text-foreground hover:bg-surface hover:text-foreground focus-visible:ring-primary/40 active:bg-surface',

  danger:
    'bg-danger text-white border border-transparent hover:bg-danger/90 focus-visible:ring-danger/40 active:bg-danger/80',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
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
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        className={`
          inline-flex
          items-center
          justify-center
          font-medium
          rounded-xl
          select-none
          transition-all
          duration-200
          ease-out
          hover:-translate-y-0.5
          active:translate-y-0
          active:scale-[0.99]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:translate-y-0
          disabled:active:scale-100
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
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
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