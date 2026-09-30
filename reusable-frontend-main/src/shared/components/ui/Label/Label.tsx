import { LabelHTMLAttributes, forwardRef } from "react";

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={`
          inline-flex
          items-center
          gap-1
          text-sm
          font-medium
          text-slate-800
          dark:text-slate-200
          ${className}
        `}
        {...props}
      >
        {children}

        {required && (
          <span
            className="text-red-500"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";