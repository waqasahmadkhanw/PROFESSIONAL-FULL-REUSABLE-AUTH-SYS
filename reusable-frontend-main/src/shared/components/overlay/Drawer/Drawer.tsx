'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

type Side = 'left' | 'right';

type Size = 'sm' | 'md' | 'lg';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  children?: ReactNode;

  side?: Side;
  size?: Size;
}

const sideClasses: Record<Side, string> = {
  left: 'left-0 top-0 h-full rounded-r-xl',
  right: 'right-0 top-0 h-full rounded-l-xl',
};

const sizeClasses: Record<Size, string> = {
  sm: 'w-72',
  md: 'w-96',
  lg: 'w-[480px]',
};

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  side = 'right',
  size = 'md',
}: DrawerProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className={`
            fixed
            ${sideClasses[side]}
            ${sizeClasses[size]}
            bg-white
            text-slate-900
            border-l
            border-slate-200
            dark:bg-slate-900
            dark:text-slate-100
            dark:border-slate-800
            p-6
            shadow-xl
            focus:outline-none
            data-[state=open]:animate-in
            data-[state=open]:slide-in-from-right
            data-[state=closed]:animate-out
            data-[state=closed]:slide-out-to-right
          `}
        >
          <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </Dialog.Title>

          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

