import z from "zod";

export const twoFactorVerifySchema = z.object({
  code: z.string().length(6),
});
