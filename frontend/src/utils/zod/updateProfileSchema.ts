import { z } from "zod";

const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(30, "First name should not exceed 30 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(30, "Last name should not exceed 30 characters"),
  email: z.string().email("Invalid email address"),
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
  age: z.number().int().min(18, "You must be at least 18 years old"),
});

export default updateProfileSchema;
