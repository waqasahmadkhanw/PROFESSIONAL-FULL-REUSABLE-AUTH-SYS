'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useToastContext, type ToastVariant } from './toast.store';

/* ------------------------------------------------------------------ */
/*  Variant Configuration                                              */
/* ------------------------------------------------------------------ */

const variantIcon: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  warning:
    'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  info:
    'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  default:
    'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
};

/* ------------------------------------------------------------------ */
/*  Single Toast Item                                                  */
/* ------------------------------------------------------------------ */

interface ToastItemProps {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  onDismiss: (id: string) => void;
}

function ToastItem({
  id,
  message,
  description,
  variant,
  onDismiss,
}: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    const enterTimer = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(enterTimer);
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 200);
  };

  const Icon = variantIcon[variant];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm gap-3 rounded-xl border p-4 shadow-lg transition-all duration-200',
        'dark:shadow-2xl',
        variantStyles[variant],
        visible && !exiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-4 opacity-0',
        exiting && 'translate-x-4 opacity-0'
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />

      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">{message}</p>
        {description && (
          <p className="text-xs opacity-80">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast Container (renders all active toasts)                       */
/* ------------------------------------------------------------------ */

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-4 z-9999 flex flex-col items-center gap-3 px-4 sm:top-6 sm:items-end sm:px-6"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          description={toast.description}
          variant={toast.variant}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
}

