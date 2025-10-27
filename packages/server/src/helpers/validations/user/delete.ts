import z from "zod";

export const deleteUserSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be between 6 and 30 characters")
    .max(30, "Password must be between 6 and 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
