interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({
  items,
}: TimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative pl-6"
        >
          <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-blue-600" />

          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {item.title}
          </h4>

          {item.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          )}

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {item.date}
          </p>
        </div>
      ))}
    </div>
  );
}