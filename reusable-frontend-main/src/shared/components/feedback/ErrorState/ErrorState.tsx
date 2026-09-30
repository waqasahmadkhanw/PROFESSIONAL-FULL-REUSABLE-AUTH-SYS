interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="page-shell flex flex-col items-center justify-center rounded-3xl px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-400/40 dark:bg-red-500/10 dark:text-white dark:hover:bg-red-500/20"
        >
          Retry
        </button>
      )}
    </div>
  );
}