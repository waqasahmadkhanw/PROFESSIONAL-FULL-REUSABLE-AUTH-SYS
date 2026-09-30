'use client';

import {
  forwardRef,
  SelectHTMLAttributes,
  useId,
} from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      placeholder = 'Select an option',
      helperText,
      error,
      options,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helperText
              ? `${selectId}-helper`
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
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-1 text-xs text-slate-600 dark:text-slate-400"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';