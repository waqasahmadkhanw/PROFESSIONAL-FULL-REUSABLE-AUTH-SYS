import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-background border border-border shadow-sm',
    elevated: 'bg-surface-elevated border border-border shadow-md',
    outlined: 'bg-transparent border-2 border-border shadow-none',
  };

  return (
    <div
      className={`
        rounded-2xl
        transition-shadow duration-200
        ${variantClasses[variant]}
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
      className={`border-b border-border p-6 ${className}`}
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
      className={`text-lg font-semibold text-foreground ${className}`}
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
      className={`mt-1 text-sm text-foreground-muted ${className}`}
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
      className={`border-t border-border p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}