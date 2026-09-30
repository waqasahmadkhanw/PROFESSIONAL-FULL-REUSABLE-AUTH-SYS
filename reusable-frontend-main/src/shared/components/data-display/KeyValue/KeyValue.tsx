import type { FC, ReactNode } from 'react';

interface KeyValueProps {
  label: string;
  children: ReactNode;
}

const KeyValue: FC<KeyValueProps> = ({ label, children }) => (
  <div className="flex items-start gap-2 py-1">
    <dt className="min-w-24 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</dt>
    <dd className="text-sm text-slate-900 dark:text-slate-100">{children}</dd>
  </div>
);

export default KeyValue;

