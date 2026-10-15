import { Spinner } from "@/shared/components/ui";

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({
  message = "Loading...",
  size = 'md',
}: LoadingProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl bg-surface p-8 text-center border border-border">
      <Spinner size={size} />
      <p className="text-sm text-foreground-muted">
        {message}
      </p>
    </div>
  );
}