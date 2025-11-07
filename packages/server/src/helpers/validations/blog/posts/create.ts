import z from "zod";
import { db } from "../../../../database/db";
import { blogAttachmentsTable } from "../../../../database";
import { eq } from "drizzle-orm";

export const createBlogPostSchema = z.object({
  title: z.string().max(255).trim().min(1),
  content: z.string().max(4028).trim().min(1),
  tags: z.array(z.string()).max(12),
  image: z.string().refine(findImage).nullable(),
  isDraft: z.boolean(),
});

export async function findImage(
  arg: string | undefined | null
): Promise<boolean> {
  if (!arg) return true;
  const [findId] = await db
    .select()
    .from(blogAttachmentsTable)
    .where(eq(blogAttachmentsTable.id, arg));
  return !!findId;
}
