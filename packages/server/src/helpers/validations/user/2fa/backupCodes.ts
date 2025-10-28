import z from "zod";

export const newBackupCodesSchema = z.object({
  code: z.string().min(6).max(8),
  twoFactorType: z.string().min(6).max(14),
});
