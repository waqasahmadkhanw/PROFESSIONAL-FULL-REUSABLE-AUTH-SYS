import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine(
    ({ newPassword, confirmPassword }) =>
      newPassword === confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  )
  .refine(
    ({ currentPassword, newPassword }) =>
      currentPassword !== newPassword,
    {
      path: ["newPassword"],
      message: "New password must be different from the current password",
    }
  );

export type ChangePasswordSchema = z.infer<
  typeof changePasswordSchema
>;