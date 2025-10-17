import z from "zod";

export const registerSchema = z.object({
  email: z.email("Email must be a valid email address"),
  password: z
    .string("Password is required")
    .min(6, "Password must be between 6 and 30 characters")
    .max(30, "Password must be between 6 and 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  firstName: z
    .string()
    .min(2, "First name must be between 2 and 30 characters")
    .max(30, "First name must be between 2 and 30 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be between 2 and 30 characters")
    .max(30, "Last name must be between 2 and 30 characters")
    .optional(),
});
