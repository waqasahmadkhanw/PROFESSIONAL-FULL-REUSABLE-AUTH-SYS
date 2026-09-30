import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional(),
  profession: z.string().trim().max(100).optional(),
  address: z.string().trim().max(250).optional(),
  avatar: z.instanceof(File).optional(),
});
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
