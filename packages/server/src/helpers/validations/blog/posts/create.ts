import z from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().max(255),
  content: z.string().max(4028),
  isDraft: z.boolean(),
});
