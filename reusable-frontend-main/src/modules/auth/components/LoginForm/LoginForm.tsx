"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { AuthDivider } from "../AuthDivider";
import { PasswordField } from "../PasswordField";
import { SocialLogin, type SocialProvider } from "../SocialLogin";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  isLoading?: boolean;
  isGoogleLoading?: boolean;
  showGoogle?: boolean;
  googleSlot?: ReactNode;
  onSubmit?: (values: LoginFormValues) => void;
  onGoogleLogin?: () => void;
}

export default function LoginForm({
  isLoading = false,
  isGoogleLoading = false,
  showGoogle = false,
  googleSlot,
  onSubmit = () => {},
  onGoogleLogin,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleProvider = (provider: SocialProvider) => {
    if (provider === "google") onGoogleLogin?.();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <div className="space-y-2">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
        </div>

        <div className="space-y-2">
          <PasswordField
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
              maxLength: { value: 100, message: "Password cannot exceed 100 characters" },
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading || isGoogleLoading}
        >
          Sign In
        </Button>
      </form>

      {showGoogle ? (
        <>
          <AuthDivider label="or continue with" />
          <SocialLogin
            providers={[{ id: "google", label: "Continue with Google" }]}
            loading={isGoogleLoading}
            loadingProvider="google"
            disabled={isLoading}
            googleSlot={googleSlot}
            onProviderClick={handleProvider}
          />
        </>
      ) : null}
    </div>
  );
}
