import { HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

const colorClasses = {
  primary: "border-blue-600 border-t-transparent",
  white: "border-white border-t-transparent",
  gray: "border-gray-500 border-t-transparent",
};

export function Spinner({
  size = "md",
  color = "primary",
  fullScreen = false,
  className = "",
  ...props
}: SpinnerProps) {
  const spinner = (
    <div
      className={`
        animate-spin
        rounded-full
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
      aria-label="Loading"
      role="status"
      {...props}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}