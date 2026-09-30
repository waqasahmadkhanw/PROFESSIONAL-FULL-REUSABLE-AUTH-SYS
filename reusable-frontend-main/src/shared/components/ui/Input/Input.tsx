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
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={`
            w-full
            rounded-2xl
            border
            bg-white
            dark:bg-slate-950/60
            px-4
            py-3
            text-sm
            text-slate-900
            dark:text-white
            outline-none
            transition-all
            duration-200
            placeholder:text-slate-400
            dark:placeholder:text-slate-500
            focus:border-indigo-500/80
            focus:ring-2
            focus:ring-indigo-500/20
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            dark:disabled:bg-slate-900/50
            ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700'
            }
            ${className}
          `}
          {...props}
        />

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-xs text-slate-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';