'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;
  children?: ReactNode;

  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
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
            left-1/2
            top-1/2
            w-full
            ${sizeClasses[size]}
            -translate-x-1/2
            -translate-y-1/2
            rounded-xl
            bg-white
            text-slate-900
            border
            border-slate-200
            dark:bg-slate-900
            dark:text-slate-100
            dark:border-slate-800
            p-6
            shadow-xl
            focus:outline-none
          `}
        >
          <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </Dialog.Title>

          {description && (
            <Dialog.Description className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </Dialog.Description>
          )}

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

