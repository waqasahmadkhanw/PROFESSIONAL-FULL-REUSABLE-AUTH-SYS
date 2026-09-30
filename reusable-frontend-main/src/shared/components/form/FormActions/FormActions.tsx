import { ReactNode } from 'react';

interface FormActionsProps {
  children: ReactNode;
}

export function FormActions({
  children,
}: FormActionsProps) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      {children}
    </div>
  );
}