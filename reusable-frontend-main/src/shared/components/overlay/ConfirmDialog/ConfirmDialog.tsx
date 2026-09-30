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
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <AlertDialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            w-full
            max-w-md
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
          <AlertDialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">
                {cancelText}
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <Button
                variant={destructive ? 'danger' : 'primary'}
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