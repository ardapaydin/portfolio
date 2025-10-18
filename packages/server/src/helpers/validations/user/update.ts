import z from "zod";

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be between 2 and 60 characters")
    .max(60, "Name must be between 2 and 60 characters")
    .optional(),
  email: z.email("Email must be a valid email address"),
  currentPassword: z
    .string("Password is required")
    .min(6, "Password must be between 6 and 30 characters")
    .max(30, "Password must be between 6 and 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional(),
  newPassword: z
    .string("Password is required")
    .min(6, "Password must be between 6 and 30 characters")
    .max(30, "Password must be between 6 and 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional(),
});
