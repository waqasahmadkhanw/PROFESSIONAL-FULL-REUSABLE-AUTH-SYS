'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip({
  content,
  children,
  side = 'top',
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={8}
            className="
              z-50
              rounded-md
              bg-gray-900
              px-3
              py-2
              text-xs
              text-white
              shadow-lg
              animate-in
              fade-in
            "
          >
            {content}

            <RadixTooltip.Arrow className="fill-gray-900" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}