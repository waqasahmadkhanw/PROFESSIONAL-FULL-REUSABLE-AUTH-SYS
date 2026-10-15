'use client';

import {
  forwardRef,
  TextareaHTMLAttributes,
  useId,
} from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      id,
      label,
      helperText,
      error,
      className = '',
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground-muted"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
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
            resize-y
            min-h-[100px]
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

Textarea.displayName = 'Textarea';