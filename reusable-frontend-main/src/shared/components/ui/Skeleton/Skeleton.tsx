import { HTMLAttributes } from 'react';

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  rounded = 'md',
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        animate-pulse
        bg-gray-200
        ${roundedClasses[rounded]}
        ${className}
      `}
      {...props}
    />
  );
}