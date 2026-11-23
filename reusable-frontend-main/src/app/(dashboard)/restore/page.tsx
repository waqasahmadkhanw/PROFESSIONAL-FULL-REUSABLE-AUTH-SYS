"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useRestoreAccount } from "@/modules/auth";
import { Button, Input } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

interface RestoreFormValues {
  email: string;
  password: string;
}

export default function RestorePage() {
  const router = useRouter();
  const { restoreAccount, isPending } = useRestoreAccount();
  const { success, error } = useToast();
  const [values, setValues] = useState<RestoreFormValues>({ email: "", password: "" });

  const handleRestore = async () => {
    const email = values.email.trim().toLowerCase();
    if (!email) {
      error("Email is required");
      return;
    }
    if (!values.password) {
      error("Password is required");
      return;
    }
    try {
      await restoreAccount({ email, password: values.password });
      success("Account restored successfully");
      router.push("/login");
    } catch (err) {
      error((err as Error)?.message ?? "Failed to restore account");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"><User className="h-5 w-5" /></span>
            <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Restore Account</h1><p className="text-sm text-slate-500 dark:text-slate-400">Restore your deactivated account.</p></div>
          </div>
          <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-900 dark:border-green-900/20 dark:bg-green-900/10 dark:text-green-100">
            Enter your account email and password to restore your account.
          </div>
          <form onSubmit={(e) => { e.preventDefault(); }} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</label>
              <Input
                type="email"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
              <Input
                type="password"
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </div>
            <Button type="button" className="w-full" loading={isPending} disabled={isPending} onClick={handleRestore}>
              {isPending ? "Restoring..." : "Restore Account"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}