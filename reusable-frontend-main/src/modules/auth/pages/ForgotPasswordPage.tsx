"use client";

import { useState } from "react";

import { ForgotPasswordForm } from "../components";
import type { ForgotPasswordFormValues } from "../components/ForgotPasswordForm/ForgotPasswordForm";
import { useForgotPassword } from "../hooks";

export default function ForgotPasswordPage() {
  const { forgotPassword, isPending } = useForgotPassword();

  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setServerError(null);

      // Previously this form's onSubmit had no default handler, so
      // submitting it never called the API and nothing happened.
      await forgotPassword({ email: values.email });

      setSubmittedEmail(values.email);
    } catch (err) {
      setServerError(
        (err as Error)?.message ??
          "Something went wrong. Please try again."
      );
    }
  };

  if (submittedEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900">Check your email</h1>
          <p className="mt-2 text-sm text-slate-600">
            If an account exists for {submittedEmail}, we&apos;ve sent a link to reset your password.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        {serverError && (
          <p className="mb-4 text-sm text-red-600">{serverError}</p>
        )}

        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isPending} />
      </section>
    </main>
  );
}
