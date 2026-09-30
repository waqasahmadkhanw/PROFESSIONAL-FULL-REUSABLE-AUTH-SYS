export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary"
          aria-label="Loading"
        />

        {/* Loading Text */}
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    </main>
  );
}