"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { PasswordField } from "../PasswordField";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  isLoading?: boolean;
  onSubmit?: (values: LoginFormValues) => void;
}

export default function LoginForm({
  isLoading = false,
  onSubmit = () => {},
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
        })}
      />

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

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Sign In
      </Button>
    </form>
  );
}