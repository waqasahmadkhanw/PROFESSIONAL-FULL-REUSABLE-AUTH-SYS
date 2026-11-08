"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { useVerifyEmail } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyEmail, isPending } = useVerifyEmail();
  const { success, error } = useToast();

  const handleVerify = async (token: string) => {
    try {
      await verifyEmail(token);
      success("Email verified successfully");
      router.push("/login?verified=1");
    } catch (err) {
      error((err as Error)?.message ?? "Failed to verify email");
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 shadow-lg shadow-green-500/30 transition-transform duration-300">
            <Mail className="h-7 w-7 text-green-600" />
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Verify Email
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter the verification code sent to your email.
          </p>
        </div>
        <form className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Verification Token</label>
          <input type="text" className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter verification code" />
          <Button type="button" className="w-full" disabled={isPending} onClick={() => handleVerify("")}>
            {isPending ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
          <span>Didn't receive the code? </span>
          <button onClick={() => router.push("/login")} className="font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300">
            Resend verification email
          </button>
        </div>
      </div>
    </div>
  );
}
