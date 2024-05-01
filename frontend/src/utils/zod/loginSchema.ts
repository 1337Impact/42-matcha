import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email().refine(value => {
        if (!/\S+@\S+\.\S+/.test(value)) {
            return "Invalid email address";
        }
        return true;
    }),
    password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password cannot exceed 16 characters"),
});