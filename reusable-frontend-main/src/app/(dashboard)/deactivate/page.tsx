"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useDeactivateAccount } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function DeactivatePage() {
  const router = useRouter();
  const { deactivateAccount, isPending } = useDeactivateAccount();
  const { success, error } = useToast();

  const handleDeactivate = async (password: string) => {
    try {
      await deactivateAccount(password);
      success("Account deactivated successfully");
      router.push("/login");
    } catch (err) {
      error((err as Error)?.message ?? "Failed to deactivate account");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"><User className="h-5 w-5" /></span>
            <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Deactivate Account</h1><p className="text-sm text-slate-500 dark:text-slate-400">Temporarily deactivate your account.</p></div>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/20 dark:bg-rose-900/10 dark:text-rose-100">
            Deactivating your account will prevent you from signing in. You can restore it later using the restoration link sent to your email.
          </div>
          <form onSubmit={(e) => { e.preventDefault(); }} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
            <input type="password" className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter your password" />
            <Button type="button" className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700" disabled={isPending} onClick={() => handleDeactivate("")}>
              {isPending ? "Deactivating..." : "Deactivate Account"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
