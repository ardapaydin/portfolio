import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().max(2048),
});
