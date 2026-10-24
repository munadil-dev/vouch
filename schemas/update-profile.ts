import { z } from "zod";
import { uploadcareImage } from "@/schemas/uploadcare";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  image: z.union([z.literal(""), uploadcareImage]).optional(),
});

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
