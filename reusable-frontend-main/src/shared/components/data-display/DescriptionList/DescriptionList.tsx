import { ReactNode } from "react";

interface Item {
  label: string;
  value: ReactNode;
}

interface DescriptionListProps {
  items: Item[];
}

export function DescriptionList({
  items,
}: DescriptionListProps) {
  return (
    <dl className="divide-y divide-slate-200 border-slate-200 dark:divide-slate-800 dark:border-slate-800 rounded-lg border">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-2 p-4"
        >
          <dt className="font-medium text-slate-700 dark:text-slate-300">
            {item.label}
          </dt>

          <dd className="text-slate-900 dark:text-slate-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}