'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            w-full
            max-w-lg
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
          "
        >
          <Dialog.Title
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            {title}
          </Dialog.Title>

          {description && (
            <Dialog.Description
              className="mt-2 text-sm text-slate-600 dark:text-slate-400"
            >
              {description}
            </Dialog.Description>
          )}

          <div className="mt-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}