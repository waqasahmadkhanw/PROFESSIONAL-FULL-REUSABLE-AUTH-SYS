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
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          className={`
            w-full
            rounded-lg
            border
            border-slate-300
            bg-white
            text-slate-900
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-white
            px-3
            py-2.5
            text-sm
            outline-none
            transition-colors
            resize-y
            placeholder:text-slate-400
            dark:placeholder:text-slate-500
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-500/20
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            dark:disabled:bg-slate-800/50
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1 text-xs text-slate-600 dark:text-slate-400"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';