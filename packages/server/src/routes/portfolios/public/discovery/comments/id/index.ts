import express from "express";
import { requireAuth } from "../../../../../../helpers/middlewares/auth";
import { db } from "../../../../../../database/db";
import { portfolioCommentsTable } from "../../../../../../database";
import { and, eq } from "drizzle-orm";
import BodyValidationMiddleware from "../../../../../../helpers/middlewares/validation";
import { createCommentSchema } from "../../../../../../helpers/validations/portfolio/comments/create";
const router = express.Router();

router.delete("/:id/comments/:commentId", requireAuth, async (req, res) => {
  const { id, commentId } = req.params;
  const [comment] = await db
    .select()
    .from(portfolioCommentsTable)
    .where(
      and(
        eq(portfolioCommentsTable.id, commentId),
        eq(portfolioCommentsTable.portfolioId, id)
      )
    );
  if (!comment)
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });

  if (comment.userId != req.user!.id)
    return res
      .status(403)
      .json({ success: false, message: "Comment is not created by this user" });

  const [del] = await db
    .delete(portfolioCommentsTable)
    .where(eq(portfolioCommentsTable.id, commentId));
  if (!del.affectedRows)
    return res
      .status(500)
      .json({ success: false, message: "An unknown error occured " });

  return res.status(200).json({ success: true });
});

router.put(
  "/:id/comments/:commentId",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createCommentSchema),
  async (req, res) => {
    const { id, commentId } = req.params;
    const { content } = req.body;
    const [comment] = await db
      .select()
      .from(portfolioCommentsTable)
      .where(
        and(
          eq(portfolioCommentsTable.id, commentId),
          eq(portfolioCommentsTable.portfolioId, id)
        )
      );
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });

    if (comment.userId != req.user!.id)
      return res.status(403).json({
        success: false,
        message: "Comment is not created by this user",
      });

    await db
      .update(portfolioCommentsTable)
      .set({
        content,
      })
      .where(eq(portfolioCommentsTable.id, commentId));

    return res.status(200).json({ success: true });
  }
);

export default router;
