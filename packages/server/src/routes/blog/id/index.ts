import express from "express";
import { requireAuth } from "../../../helpers/middlewares/auth";
import { db } from "../../../database/db";
import { blogTable } from "../../../database/schemas/blog";
import { and, eq } from "drizzle-orm";
import BodyValidationMiddleware from "../../../helpers/middlewares/validation";
import { createBlogSchema } from "../../../helpers/validations/blog/create";
import postsRouter from "./posts";
import { blogPostTable, usersTable } from "../../../database";
const router = express.Router();

router.get("/:id", requireAuth, async (req, res) => {
  const [blog] = await db
    .select()
    .from(blogTable)
    .where(
      and(eq(blogTable.id, req.params.id), eq(blogTable.userId, req.user!.id))
    );
  if (!blog)
    return res.status(404).json({ success: false, message: "Blog not found." });
  const posts = await db
    .select({
      id: blogPostTable.id,
      title: blogPostTable.title,
      content: blogPostTable.content,
      tags: blogPostTable.tags,
      createdBy: {
        name: usersTable.name,
        profilePicture: usersTable.profilePicture,
      },
      createdAt: blogPostTable.createdAt,
      updatedAt: blogPostTable.updatedAt,
    })
    .from(blogPostTable)
    .leftJoin(usersTable, eq(usersTable.id, blog.userId))
    .where(eq(blogPostTable.blogId, req.params.id));
  return res.status(200).json({
    success: true,
    name: blog.name,
    posts: posts.map((post) => ({
      ...post,
      tags: JSON.parse(post.tags as string),
    })),
  });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const [del] = await db
    .delete(blogTable)
    .where(
      and(eq(blogTable.id, req.params.id), eq(blogTable.userId, req.user!.id))
    );
  if (!del.affectedRows)
    return res.status(404).json({ success: false, message: "Blog not found." });
  return res.status(200).json({ success: true });
});

router.put(
  "/:id",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createBlogSchema),
  async (req, res) => {
    const [update] = await db
      .update(blogTable)
      .set({
        name: req.body.name,
      })
      .where(
        and(eq(blogTable.userId, req.user!.id), eq(blogTable.id, req.params.id))
      );

    if (!update.affectedRows)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });

    return res.status(200).json({ success: true });
  }
);

router.use(postsRouter);

export default router;
