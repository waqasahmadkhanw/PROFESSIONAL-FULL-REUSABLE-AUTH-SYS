'use client';

import { useCallback } from 'react';
import { useToastContext, type ToastVariant } from './toast.store';

export interface ToastOptions {
  message: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const { addToast } = useToastContext();

  const toast = useCallback(
    (options: ToastOptions) => {
      return addToast({
        message: options.message,
        description: options.description,
        variant: options.variant ?? 'default',
        duration: options.duration ?? 4000,
      });
    },
    [addToast]
  );

  const success = useCallback(
    (message: string, description?: string) => {
      return addToast({ message, description, variant: 'success' });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, description?: string) => {
      return addToast({ message, description, variant: 'error' });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, description?: string) => {
      return addToast({ message, description, variant: 'warning' });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, description?: string) => {
      return addToast({ message, description, variant: 'info' });
    },
    [addToast]
  );

  return { toast, success, error, warning, info };
}

