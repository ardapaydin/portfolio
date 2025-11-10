import express from "express";
import { requireAuth } from "../../../../../helpers/middlewares/auth";
import BodyValidationMiddleware from "../../../../../helpers/middlewares/validation";
import { createCommentSchema } from "../../../../../helpers/validations/portfolio/comments/create";
import { db } from "../../../../../database/db";
import { portfolioTable, usersTable } from "../../../../../database";
import { and, eq } from "drizzle-orm";
import { portfolioCommentsTable } from "../../../../../database/schemas/portfolioComments";
const router = express.Router();

router.get("/:id/comments", requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(
        eq(portfolioTable.id, id),
        eq(portfolioTable.discoverable, true),
        eq(portfolioTable.isPublished, true)
      )
    );

  if (!portfolio)
    return res.status(404).json({
      success: false,
      message: "Portfolio not found or not discoverable.",
    });

  const comments = await db
    .select({
      id: portfolioCommentsTable.id,
      content: portfolioCommentsTable.content,
      userId: portfolioCommentsTable.userId,
      createdBy: {
        id: usersTable.id,
        name: usersTable.name,
        profilePicture: usersTable.profilePicture,
      },
      createdAt: portfolioCommentsTable.createdAt,
      updatedAt: portfolioCommentsTable.updatedAt,
    })
    .from(portfolioCommentsTable)
    .leftJoin(usersTable, eq(usersTable.id, portfolioCommentsTable.userId))
    .where(eq(portfolioCommentsTable.portfolioId, id));

  return res.status(200).json(comments);
});

router.post(
  "/:id/comments",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createCommentSchema),
  async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const [find] = await db
      .select()
      .from(portfolioTable)
      .where(
        and(
          eq(portfolioTable.id, id),
          eq(portfolioTable.discoverable, true),
          eq(portfolioTable.isPublished, true)
        )
      );

    if (!find)
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or not discoverable.",
      });

    const [{ id: commentId }] = await db
      .insert(portfolioCommentsTable)
      .values({
        content,
        userId: req.user!.id,
        portfolioId: id,
      })
      .$returningId();

    const [comment] = await db
      .select({
        id: portfolioCommentsTable.id,
        content: portfolioCommentsTable.content,
        userId: portfolioCommentsTable.userId,
        createdBy: {
          id: usersTable.id,
          name: usersTable.name,
          profilePicture: usersTable.profilePicture,
        },
        createdAt: portfolioCommentsTable.createdAt,
        updatedAt: portfolioCommentsTable.updatedAt,
      })
      .from(portfolioCommentsTable)
      .leftJoin(usersTable, eq(usersTable.id, portfolioCommentsTable.userId))
      .where(eq(portfolioCommentsTable.id, commentId));

    return res.status(200).json({ success: true, data: comment });
  }
);

import idRouter from "./id";
router.use(idRouter);

export default router;
