"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/ui/Input";
import { PasswordField } from "../PasswordField";
import { Button } from "@/shared/components/ui/Button";

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  isLoading?: boolean;
  onSubmit?: (values: RegisterFormValues) => void;
}

export default function RegisterForm({
  isLoading = false,
  onSubmit = () => {},
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="Enter first name"
          error={errors.firstName?.message}
          {...register("firstName", {
            required: "First name is required",
            minLength: { value: 2, message: "First name must be at least 2 characters" },
            maxLength: { value: 50, message: "First name cannot exceed 50 characters" },
          })}
        />

        <Input
          label="Last Name"
          placeholder="Enter last name"
          error={errors.lastName?.message}
          {...register("lastName", {
            required: "Last name is required",
            minLength: { value: 2, message: "Last name must be at least 2 characters" },
            maxLength: { value: 50, message: "Last name cannot exceed 50 characters" },
          })}
        />
      </div>

      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" },
        })}
      />

      <PasswordField
        label="Password"
        placeholder="Create a password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
          maxLength: { value: 128, message: "Password cannot exceed 128 characters" },
        })}
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Confirm password is required",
          validate: (value, formValues) => value === formValues.password || "Passwords do not match",
        })}
      />

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
}