import z from "zod";

export const editPasskeySchema = z.object({
  name: z.string().trim().max(50),
});
