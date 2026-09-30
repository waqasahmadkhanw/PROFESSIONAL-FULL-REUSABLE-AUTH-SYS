import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-muted-foreground">Reusable Next.js Starter Kit</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Build your application on a clean foundation.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Authentication, API infrastructure, state management, validation, UI primitives and integration adapters are ready.
          Add application-specific modules without coupling them to the starter kit.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Sign in</Link>
          <Link href="/register" className="rounded-md border px-4 py-2">Create account</Link>
        </div>
      </div>
    </main>
  );
}
