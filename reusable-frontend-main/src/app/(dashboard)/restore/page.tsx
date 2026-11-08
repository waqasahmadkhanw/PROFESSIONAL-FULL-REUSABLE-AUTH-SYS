"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useRestoreAccount } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function RestorePage() {
  const router = useRouter();
  const { restoreAccount, isPending } = useRestoreAccount();
  const { success, error } = useToast();

  const handleRestore = async (token: string) => {
    try {
      await restoreAccount(token);
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
            Enter the restoration token sent to your email to restore your account.
          </div>
          <form onSubmit={(e) => { e.preventDefault(); }} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Restoration Token</label>
            <input type="text" className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter restoration token" />
            <Button type="button" className="w-full" disabled={isPending} onClick={() => restoreAccount("")}>
              {isPending ? "Restoring..." : "Restore Account"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
