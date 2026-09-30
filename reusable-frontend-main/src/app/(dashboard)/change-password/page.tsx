"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ChangePasswordForm, useChangePassword, useAuthGuard } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function ChangePasswordPage() {
  useAuthGuard();
  const router = useRouter();
  const { changePassword, isPending } = useChangePassword();
  const { success, error } = useToast();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><ShieldCheck className="h-5 w-5" /></span>
            <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Change password</h1><p className="text-sm text-slate-500 dark:text-slate-400">Use your current password to set a new one.</p></div>
          </div>
          <ChangePasswordForm
            isLoading={isPending}
            onSubmit={async ({ currentPassword, newPassword, confirmPassword }) => {
              if (newPassword !== confirmPassword) { error("Passwords do not match"); return; }
              try {
                await changePassword({ oldPassword: currentPassword, newPassword });
                success("Password changed successfully");
                router.push("/profile");
              } catch (err) {
                error((err as Error)?.message ?? "Failed to change password");
              }
            }}
          />
        </section>
      </div>
    </main>
  );
}
