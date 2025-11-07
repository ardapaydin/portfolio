import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { blogPostTable } from "../../../../database/schemas/blogPost";
import { and, eq } from "drizzle-orm";
import { blogTable, usersTable } from "../../../../database";
import BodyValidationMiddleware from "../../../../helpers/middlewares/validation";
import { createBlogPostSchema } from "../../../../helpers/validations/blog/posts/create";
const router = express.Router();

router.get("/:id/posts", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [blog] = await db
    .select()
    .from(blogTable)
    .where(and(eq(blogTable.id, id), eq(blogTable.userId, req.user!.id)));
  if (!blog)
    return res.status(404).json({ success: false, message: "Blog not found." });
  const posts = await db
    .select({
      id: blogPostTable.id,
      title: blogPostTable.title,
      content: blogPostTable.content,
      createdBy: {
        name: usersTable.name,
        profilePicture: usersTable.profilePicture,
      },
      createdAt: blogPostTable.createdAt,
      updatedAt: blogPostTable.updatedAt,
    })
    .from(blogPostTable)
    .leftJoin(usersTable, eq(usersTable.id, blog.userId))
    .where(eq(blogPostTable.blogId, id));

  return res.status(200).json(posts);
});

router.post(
  "/:id/posts",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createBlogPostSchema),
  async (req, res) => {
    const { id } = req.params;
    const { title, content, isDraft, tags, image } = req.body;
    const [blog] = await db
      .select()
      .from(blogTable)
      .where(and(eq(blogTable.id, id), eq(blogTable.userId, req.user!.id)));

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });

    const [{ id: postId }] = await db
      .insert(blogPostTable)
      .values({
        blogId: id,
        title,
        content,
        tags,
        isDraft,
        image,
      })
      .$returningId();
    const [post] = await db
      .select({
        id: blogPostTable.id,
        title: blogPostTable.title,
        content: blogPostTable.content,
        tags: blogPostTable.tags,
        image: blogPostTable.image,
        isDraft: blogPostTable.isDraft,
        createdBy: {
          name: usersTable.name,
          profilePicture: usersTable.profilePicture,
        },
        createdAt: blogPostTable.createdAt,
        updatedAt: blogPostTable.updatedAt,
      })
      .from(blogPostTable)
      .leftJoin(usersTable, eq(usersTable.id, blog.userId))
      .where(eq(blogPostTable.id, postId));

    return res.status(200).json({
      success: true,
      data: { ...post, tags: JSON.parse(post.tags as string) },
    });
  }
);

router.delete("/:id/posts/:postId", requireAuth, async (req, res) => {
  const { id, postId } = req.params;

  const [blog] = await db
    .select()
    .from(blogTable)
    .where(and(eq(blogTable.userId, req.user!.id), eq(blogTable.id, id)));

  if (!blog)
    return res.status(404).json({ success: false, message: "Blog not found." });

  const [del] = await db
    .delete(blogPostTable)
    .where(and(eq(blogPostTable.blogId, id), eq(blogPostTable.id, postId)));

  if (!del.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: "Blog post not found." });

  return res.status(200).json({ success: false });
});

export default router;
