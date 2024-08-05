import { z } from "zod";

const completeProfileSchema = z.object({
  gender: z.string().min(1, "Gender is required"),
  sexual_preferences: z.string().min(1, "Sexual preferences are required"),
  biography: z
    .string()
    .min(10, "Biography should be at least 10 characters")
    .max(200, "Biography should not exceed 200 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  images: z
  .array(z.string())
  .min(1, "At least one image is required")
  .refine((images) => images.some((image) => image.trim().length > 0), {
    message: "At least one image is required",
  }),
});

export default completeProfileSchema;