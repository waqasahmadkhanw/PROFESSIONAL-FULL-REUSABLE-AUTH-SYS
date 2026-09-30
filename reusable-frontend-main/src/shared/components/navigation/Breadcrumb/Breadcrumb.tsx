'use client';

import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({
  items,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {last ? (
                <span
                  className="font-medium text-slate-900 dark:text-white"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href ?? '#'}
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {item.label}
                  </Link>

                  <span>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}