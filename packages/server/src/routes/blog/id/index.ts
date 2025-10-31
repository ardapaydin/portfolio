import express from "express";
import { requireAuth } from "../../../helpers/middlewares/auth";
import { db } from "../../../database/db";
import { blogTable } from "../../../database/schemas/blog";
import { and, eq } from "drizzle-orm";
import BodyValidationMiddleware from "../../../helpers/middlewares/validation";
import { createBlogSchema } from "../../../helpers/validations/blog/create";
import postsRouter from "./posts";
const router = express.Router();

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
