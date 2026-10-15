'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
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
        <Dialog.Overlay
          className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
          aria-hidden="true"
        />

        <Dialog.Content
          className={`
            fixed
            left-1/2
            top-1/2
            w-full
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            bg-background
            text-foreground
            border
            border-border
            shadow-xl
            p-6
            focus:outline-none
            animate-scale-in
            ${sizeClasses[size]}
          `}
        >
          <Dialog.Close
            className="
              absolute
              right-4
              top-4
              rounded-lg
              p-1.5
              text-foreground-subtle
              hover:text-foreground
              hover:bg-surface
              transition-colors
              duration-200
              focus-visible:ring-2
              focus-visible:ring-primary/30
            "
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Dialog.Close>

          <div className="mb-4">
            <Dialog.Title
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </Dialog.Title>

            {description && (
              <Dialog.Description
                className="mt-1.5 text-sm text-foreground-muted"
              >
                {description}
              </Dialog.Description>
            )}
          </div>

          <div className="mt-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}