import z from "zod";

export const createBlogSchema = z.object({
  name: z.string().max(255),
});
