'use client';

import {
  forwardRef,
  InputHTMLAttributes,
  useId,
} from 'react';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground-muted"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          aria-required={required}
          className={`
            w-full
            rounded-xl
            border
            bg-background
            px-4
            py-3
            text-sm
            text-foreground
            outline-none
            transition-all
            duration-200
            placeholder:text-foreground-subtle
            disabled:cursor-not-allowed
            disabled:opacity-50
            focus:ring-2
            focus:ring-primary/30
            focus:border-primary
            ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/30'
                : 'border-border hover:border-border-strong'
            }
            ${className}
          `}
          {...props}
        />

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1.5 text-xs text-foreground-subtle"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-xs text-danger flex items-center gap-1"
            role="alert"
          >
            <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';