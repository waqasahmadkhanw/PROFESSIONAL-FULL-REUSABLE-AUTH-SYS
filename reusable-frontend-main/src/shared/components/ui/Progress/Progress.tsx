'use client';

import * as RadixProgress from '@radix-ui/react-progress';
import { forwardRef } from 'react';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof RadixProgress.Root> {
  value?: number;
  showValue?: boolean;
}

export const Progress = forwardRef<
  React.ElementRef<typeof RadixProgress.Root>,
  ProgressProps
>(
  (
    {
      value = 0,
      showValue = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const progress = Math.min(Math.max(value, 0), 100);

    return (
      <div className="w-full">
        <RadixProgress.Root
          ref={ref}
          value={progress}
          className={`
            relative
            h-2.5
            w-full
            overflow-hidden
            rounded-full
            bg-slate-200
            dark:bg-slate-800
            ${className}
          `}
          {...props}
        >
          <RadixProgress.Indicator
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{
              transform: `translateX(-${100 - progress}%)`,
            }}
          />
        </RadixProgress.Root>

        {showValue && (
          <div className="mt-2 text-right text-sm font-medium text-slate-700 dark:text-slate-400">
            {progress}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';