// import z from "zod";

// export const signupSchema = z.object({
//     email: z.string().email().refine(value => {
//         if (!/\S+@\S+\.\S+/.test(value)) {
//             return "Invalid email address";
//         }
//         return true;
//     }),
//     first_name: z.string().min(3, "First name must be at least 3 characters long").max(30, "First name cannot exceed 30 characters"),
//     last_name: z.string().min(3, "Last name must be at least 3 characters long").max(30, "Last name cannot exceed 30 characters"),
//     username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username cannot exceed 20 characters"),
//     password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password cannot exceed 16 characters"),
// });

// export const loginSchema = z.object({
//     email: z.string().email().refine(value => {
//         if (!/\S+@\S+\.\S+/.test(value)) {
//             return "Invalid email address";
//         }
//         return true;
//     }),
//     password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password cannot exceed 16 characters"),
// });