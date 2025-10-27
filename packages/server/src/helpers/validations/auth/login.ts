import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email must be a valid email address"),
  password: z
    .string("Password is required")
    .min(6, "Password must be between 6 and 30 characters")
    .max(30, "Password must be between 6 and 30 characters"),
  twoFactorType: z.enum(["app", "backup"]).optional(),
  code: z.string().min(6).max(8).optional(),
});
