"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, AlertCircle } from "lucide-react";

import { RegisterForm } from "../components";
import type { RegisterFormValues } from "../components/RegisterForm/RegisterForm";
import { useRegister } from "../hooks";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isPending } = useRegister();

  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      setServerError("Passwords do not match.");
      return;
    }

    try {
      setServerError(null);

      await register({
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        password: values.password,
      });

      router.push("/login?registered=1");
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
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <UserPlus className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Create Account</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Start your account and workspace journey today
          </p>
        </div>

        {/* Server Error Banner */}
        {serverError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-900 backdrop-blur-md animate-slide-up dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Register Form */}
        <RegisterForm onSubmit={handleSubmit} isLoading={isPending} />

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
