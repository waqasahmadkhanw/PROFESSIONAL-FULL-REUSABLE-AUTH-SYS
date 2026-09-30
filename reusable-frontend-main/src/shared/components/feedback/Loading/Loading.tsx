import { Spinner } from "@/shared/components/ui";

interface LoadingProps {
  message?: string;
}

export function Loading({
  message = "Loading...",
}: LoadingProps) {
  return (
    <div className="page-shell flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl px-6 py-10 text-center">
      <Spinner size="lg" />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {message}
      </p>
    </div>
  );
}