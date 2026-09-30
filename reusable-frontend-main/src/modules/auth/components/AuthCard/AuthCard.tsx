import { ReactNode } from "react";

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  className = "",
}: AuthCardProps) {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}