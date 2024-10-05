import z from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    first_name: z
      .string()
      .min(3, "First name must be at least 3 characters long")
      .max(20, "First name cannot exceed 20 characters"),
    last_name: z
      .string()
      .min(3, "Last name must be at least 3 characters long")
      .max(20, "Last name cannot exceed 20 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username cannot exceed 20 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password cannot exceed 16 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
  })
  .refine(
    (data) => {
      const { password, first_name, last_name } = data;
      const lowerPassword = password.toLowerCase();
      const lowerFirstName = first_name.toLowerCase();
      const lowerLastName = last_name.toLowerCase();

      return (
        !lowerPassword.includes(lowerFirstName) &&
        !lowerPassword.includes(lowerLastName)
      );
    },
    {
      message: "Password should not contain your first name or last name",
      path: ["password"], // This will make the error appear on the password field
    }
  );
