"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { useVerifyEmail } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";
import { resolvePostVerifyRedirect } from "../utils/auth.redirect";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, isPending } = useVerifyEmail();
  const { success, error } = useToast();
  const [token, setToken] = useState("");
  const autoVerifyAttempted = useRef(false);

  const callbackUrl = searchParams.get("callbackUrl");
  const tokenFromUrl = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  useEffect(() => {
    if (!tokenFromUrl || autoVerifyAttempted.current) return;
    autoVerifyAttempted.current = true;
    let cancelled = false;
    (async () => {
      try {
        await verifyEmail(tokenFromUrl);
        if (cancelled) return;
        success("Email verified successfully");
        router.replace(resolvePostVerifyRedirect(callbackUrl));
      } catch (err) {
        if (!cancelled) error((err as Error)?.message ?? "Failed to verify email");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [callbackUrl, error, router, success, tokenFromUrl, verifyEmail]);

  const handleVerify = async (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      error("Verification token is required");
      return;
    }
    try {
      await verifyEmail(normalized);
      success("Email verified successfully");
      router.replace(resolvePostVerifyRedirect(callbackUrl));
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
            {tokenFromUrl ? "Verifying your email link…" : "Enter the verification code sent to your email."}
          </p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleVerify(token); }}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Verification Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter verification code"
            autoComplete="one-time-code"
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
          <button onClick={() => router.push("/login")} className="inline-flex items-center gap-1 font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
