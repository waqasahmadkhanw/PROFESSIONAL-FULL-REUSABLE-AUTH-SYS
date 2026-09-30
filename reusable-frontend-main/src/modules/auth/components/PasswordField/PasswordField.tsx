"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const PasswordField = forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(
  (
    {
      label,
      error,
      containerClassName = "",
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700 ${
              error ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20" : ""
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium text-rose-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;