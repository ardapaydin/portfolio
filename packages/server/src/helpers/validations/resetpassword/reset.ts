import z from "zod";
import { validateKey } from "../../email/reset";

export const resetPasswordSchema = z.object({
  key: z
    .string("Key must be provided")
    .refine(validateKey, "Expired or invalid key"),
  password: z
    .string("Password is required")
    .min(6, "Password must be between 6 and 30 characters")
    .max(30, "Password must be between 6 and 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
