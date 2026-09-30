"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { PasswordField } from "../PasswordField";

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  isLoading?: boolean;
  onSubmit?: (values: ResetPasswordFormValues) => void;
}

export default function ResetPasswordForm({
  isLoading = false,
  onSubmit = () => {},
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <PasswordField
        label="New Password"
        placeholder="Enter your new password"
        error={errors.password?.message}
        {...register("password", {
          required: "New password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
          maxLength: { value: 100, message: "Password cannot exceed 100 characters" },
        })}
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm your new password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
        })}
      />

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Reset Password
      </Button>
    </form>
  );
}