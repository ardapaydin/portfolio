import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { blogPostTable } from "../../../../database/schemas/blogPost";
import { and, eq } from "drizzle-orm";
const router = express.Router();

router.get("/:id/posts", requireAuth, async (req, res) => {
  const { id } = req.params;
  const posts = await db
    .select()
    .from(blogPostTable)
    .where(and(eq(blogPostTable.blogId, id), eq(blogPostTable.isDraft, false)));

  return res.status(200).json(posts);
});

export default router;
