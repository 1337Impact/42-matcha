import { z } from "zod";

export const passwordUpdateSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
  confirmPassword: z
    .string()
    .min(8, "Password confirmation must be at least 8 characters long")
    .nonempty("Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Error will be associated with confirmPassword
});
