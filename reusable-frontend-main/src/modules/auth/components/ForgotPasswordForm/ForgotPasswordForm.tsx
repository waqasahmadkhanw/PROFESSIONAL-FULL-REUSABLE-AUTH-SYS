"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export interface ForgotPasswordFormValues {
  email: string;
}

interface ForgotPasswordFormProps {
  isLoading?: boolean;
  onSubmit?: (values: ForgotPasswordFormValues) => void;
}

export default function ForgotPasswordForm({
  isLoading = false,
  onSubmit = () => {},
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
        })}
      />

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Send Reset Link
      </Button>
    </form>
  );
}