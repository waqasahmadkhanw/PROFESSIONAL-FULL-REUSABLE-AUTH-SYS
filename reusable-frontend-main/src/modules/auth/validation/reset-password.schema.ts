import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, "Reset token is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type ResetPasswordSchema = z.infer<
  typeof resetPasswordSchema
>;