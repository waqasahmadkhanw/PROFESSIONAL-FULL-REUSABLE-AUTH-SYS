import { z } from "zod";

export const commonSchemas = {
  id: z.string().trim().min(1),
  email: z.string().trim().email().max(254),
  nonEmptyString: z.string().trim().min(1),
  positiveInt: z.number().int().positive(),
} as const;
