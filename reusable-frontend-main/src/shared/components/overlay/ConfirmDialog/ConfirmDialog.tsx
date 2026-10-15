'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from '@/shared/components/ui';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  destructive?: boolean;

  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
          aria-hidden="true"
        />

        <AlertDialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            w-full
            max-w-md
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
          "
        >
          <AlertDialog.Title className="text-lg font-semibold text-foreground">
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm text-foreground-muted">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button
                variant="ghost"
                size="md"
              >
                {cancelText}
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <Button
                variant={destructive ? 'danger' : 'primary'}
                size="md"
                loading={loading}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}