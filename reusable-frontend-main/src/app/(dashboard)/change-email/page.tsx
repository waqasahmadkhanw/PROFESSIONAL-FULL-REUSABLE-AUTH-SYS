"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { useRequestEmailChange, useVerifyEmailChange } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function ChangeEmailPage() {
  const router = useRouter();
  const { requestEmailChange, isPending: isRequesting } = useRequestEmailChange();
  const { verifyEmailChange, isPending: isVerifying } = useVerifyEmailChange();
  const { success, error } = useToast();

  const [step, setStep] = useState<"request" | "verify">("request");

  const handleRequest = async (newEmail: string, password: string) => {
    try {
      await requestEmailChange(newEmail, password);
      success("Verification email sent. Check your inbox.");
      setStep("verify");
    } catch (err) {
      error((err as Error)?.message ?? "Failed to request email change");
    }
  };

  const handleVerify = async (token: string) => {
    try {
      await verifyEmailChange(token);
      success("Email changed successfully");
      router.push("/profile");
    } catch (err) {
      error((err as Error)?.message ?? "Failed to verify email change");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><Mail className="h-5 w-5" /></span>
            <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Change Email</h1><p className="text-sm text-slate-500 dark:text-slate-400">Update your email address.</p></div>
          </div>
          {step === "request" ? (
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Email Address</label>
              <input type="email" className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="newemail@example.com" />
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
              <input type="password" className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter your current password" />
              <Button type="button" className="w-full" disabled={isRequesting} onClick={() => handleRequest("", "")}>
                {isRequesting ? "Sending..." : "Request Change"}
              </Button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Verification Token</label>
              <input type="text" className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter verification code" />
              <Button type="button" className="w-full" disabled={isVerifying} onClick={() => handleVerify("")}>
                {isVerifying ? "Verifying..." : "Verify & Change"}
              </Button>
              <Button variant="secondary" type="button" className="w-full" onClick={() => setStep("request")}>Back</Button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
