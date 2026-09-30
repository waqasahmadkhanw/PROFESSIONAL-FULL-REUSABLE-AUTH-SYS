import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        glass-panel
        rounded-3xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`border-b border-slate-200 dark:border-white/10 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <h3
      className={`text-lg font-semibold text-slate-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <p
      className={`mt-1 text-sm text-slate-600 dark:text-slate-300 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`border-t border-slate-200 dark:border-white/10 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
