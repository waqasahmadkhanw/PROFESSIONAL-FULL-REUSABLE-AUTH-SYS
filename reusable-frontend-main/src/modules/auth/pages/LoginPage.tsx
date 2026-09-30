"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

import { LoginForm } from "../components";
import type { LoginFormValues } from "../components/LoginForm/LoginForm";
import { useLogin } from "../hooks";
import { getDashboardRedirect, getSafeCallbackUrl } from "../utils/auth.redirect";

export interface LoginPageProps {
  onSuccess?: () => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isPending, error } = useLogin();

  const [serverError, setServerError] = useState<string | null>(null);

  const justRegistered = searchParams.get("registered") === "1";
  const justReset = searchParams.get("reset") === "1";

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setServerError(null);

      const response = await login({
        email: values.email,
        password: values.password,
      });

      const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl") ?? undefined);
      const destination = callbackUrl || getDashboardRedirect(response.user.role);

      onSuccess?.();
      router.replace(destination);
    } catch (err) {
      setServerError(
        (err as Error)?.message ??
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-105">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Secure Portal</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to access your account
          </p>
        </div>

        {/* Banners */}
        {justRegistered && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-medium text-blue-900 backdrop-blur-md dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Account created. An administrator will activate your account shortly.</span>
          </div>
        )}

        {justReset && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900 backdrop-blur-md dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Password reset completed. You can now sign in with your new password.</span>
          </div>
        )}

        {(serverError || error?.message) && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-900 backdrop-blur-md animate-slide-up dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{serverError || error?.message}</span>
          </div>
        )}

        {/* Login Form */}
        <LoginForm onSubmit={handleSubmit} isLoading={isPending} />

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
