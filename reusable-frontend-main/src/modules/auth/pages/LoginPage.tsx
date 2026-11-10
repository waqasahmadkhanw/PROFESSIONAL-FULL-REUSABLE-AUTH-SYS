"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

import { env } from "@/shared/config/env";
import { LoginForm } from "../components";
import type { LoginFormValues } from "../components/LoginForm/LoginForm";
import { useGoogleLogin, useLogin } from "../hooks";
import { resolvePostAuthRedirect } from "../utils/auth.redirect";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export interface LoginPageProps {
  onSuccess?: () => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isPending, error } = useLogin();
  const { googleLogin, isPending: isGooglePending, error: googleError } = useGoogleLogin();

  const [serverError, setServerError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleInFlightRef = useRef(false);

  const justRegistered = searchParams.get("registered") === "1";
  const justReset = searchParams.get("reset") === "1";
  const googleClientId = env.GOOGLE_CLIENT_ID;

  const redirectAfterAuth = (role?: string) => {
    const destination = resolvePostAuthRedirect(role, searchParams.get("callbackUrl"));
    onSuccess?.();
    router.replace(destination);
  };

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    let cancelled = false;

    const init = () => {
      if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          if (!credential || googleInFlightRef.current) return;
          googleInFlightRef.current = true;
          try {
            setServerError(null);
            const response = await googleLogin(credential);
            redirectAfterAuth(response.user.role);
          } catch (err) {
            setServerError(
              (err as { message?: string } | Error)?.message ??
                "Google sign-in failed. Please try again.",
            );
          } finally {
            googleInFlightRef.current = false;
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: googleButtonRef.current.offsetWidth || 320,
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      init();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", init);
      return () => {
        cancelled = true;
        existing.removeEventListener("load", init);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    script.onerror = () => {
      if (!cancelled) setGoogleReady(false);
    };
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.onload = null;
    };
  }, [googleClientId, googleLogin, router, searchParams]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setServerError(null);

      const response = await login({
        email: values.email,
        password: values.password,
      });

      redirectAfterAuth(response.user.role);
    } catch (err) {
      setServerError(
        (err as { message?: string } | Error)?.message ??
          "Something went wrong. Please try again."
      );
    }
  };

  const displayError = serverError || googleError?.message || error?.message;

  return (
    <div className="w-full animate-fade-in">
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80">
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

        {displayError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-900 backdrop-blur-md animate-slide-up dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{displayError}</span>
          </div>
        )}

        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          isGoogleLoading={isGooglePending}
          showGoogle={Boolean(googleClientId)}
          googleSlot={
            googleClientId ? (
              <div className="flex justify-center">
                <div ref={googleButtonRef} className="min-h-[44px] w-full max-w-[320px]" />
                {!googleReady ? (
                  <span className="sr-only">Loading Google sign-in…</span>
                ) : null}
              </div>
            ) : undefined
          }
        />

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
