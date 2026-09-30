"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { PasswordField } from "../PasswordField";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  isLoading?: boolean;
  onSubmit: (values: ChangePasswordFormValues) => void;
}

export default function ChangePasswordForm({
  isLoading = false,
  onSubmit,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
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
        label="Current Password"
        placeholder="Enter your current password"
        error={errors.currentPassword?.message}
        {...register("currentPassword", {
          required: "Current password is required",
        })}
      />

      <PasswordField
        label="New Password"
        placeholder="Enter your new password"
        error={errors.newPassword?.message}
        {...register("newPassword", {
          required: "New password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
          maxLength: { value: 100, message: "Password cannot exceed 100 characters" },
        })}
      />

      <PasswordField
        label="Confirm New Password"
        placeholder="Confirm your new password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your new password",
        })}
      />

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Change Password
      </Button>
    </form>
  );
}