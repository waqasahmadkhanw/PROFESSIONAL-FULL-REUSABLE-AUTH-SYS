"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { ResetPasswordForm } from "../components";
import type { ResetPasswordFormValues } from "../components/ResetPasswordForm/ResetPasswordForm";
import { useResetPassword } from "../hooks";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ token?: string }>();
  const token = searchParams.get("token") || params?.token || null;

  const { resetPassword, isPending } = useResetPassword();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setServerError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setServerError("Passwords do not match.");
      return;
    }

    try {
      setServerError(null);

      // Previously this form's onSubmit had no default handler at
      // all — submitting it never called the API, and the reset
      // token from the email link (?token=...) was never read or
      // sent anywhere.
      await resetPassword({ token, password: values.password });

      router.push("/login?reset=1");
    } catch (err) {
      setServerError(
        (err as Error)?.message ??
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        {!token && (
          <p className="mb-4 text-sm text-red-600">
            This reset link is missing or invalid. Please request a new one from the forgot password page.
          </p>
        )}
        {serverError && (
          <p className="mb-4 text-sm text-red-600">{serverError}</p>
        )}

        <ResetPasswordForm onSubmit={handleSubmit} isLoading={isPending} />
      </section>
    </main>
  );
}
