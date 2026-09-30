"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface RememberMeProps {
  register: UseFormRegisterReturn;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function RememberMe({
  register,
  label = "Remember me",
  disabled = false,
  className = "",
}: RememberMeProps) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${className}`}
    >
      <input
        type="checkbox"
        disabled={disabled}
        className="h-4 w-4 rounded-md border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-slate-900"
        {...register}
      />

      <span className="text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
        {label}
      </span>
    </label>
  );
}