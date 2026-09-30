import { HTMLAttributes } from "react";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className = "",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block h-full w-px bg-gray-200 ${className}`}
      />
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={`w-full border-0 border-t border-gray-200 ${className}`}
      {...props}
    />
  );
}