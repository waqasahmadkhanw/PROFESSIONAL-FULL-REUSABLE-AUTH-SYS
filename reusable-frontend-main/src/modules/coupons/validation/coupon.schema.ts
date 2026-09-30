import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Coupon code must be at least 2 characters")
      .max(50, "Coupon code cannot exceed 50 characters")
      .regex(/^[A-Z0-9_-]+$/i, "Coupon code contains invalid characters"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.coerce.number().finite().positive("Discount must be greater than 0"),
    expiryDate: z.string().min(1, "Expiry date is required"),
  })
  .superRefine((data, ctx) => {
    const expiry = new Date(data.expiryDate);
    if (Number.isNaN(expiry.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiryDate"], message: "Enter a valid expiry date" });
      return;
    }
    if (expiry.getTime() <= Date.now()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiryDate"], message: "Expiry date must be in the future" });
    }
    if (data.discountType === "percentage" && data.discountValue > 100) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["discountValue"], message: "Percentage discount cannot exceed 100" });
    }
  });

export type CouponFormValues = z.infer<typeof couponSchema>;
