import express from "express";
import { requireAuth } from "../../../../../helpers/middlewares/auth";
import { db } from "../../../../../database/db";
import { portfolioLikesTable, portfolioTable } from "../../../../../database";
import { and, eq } from "drizzle-orm";
const router = express.Router();

router.post("/:id/like", requireAuth, async (req, res) => {
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

  const [like] = await db
    .select()
    .from(portfolioLikesTable)
    .where(
      and(
        eq(portfolioLikesTable.userId, req.user!.id),
        eq(portfolioLikesTable.portfolioId, id)
      )
    );

  if (like)
    return res.status(409).json({ success: false, message: " Already liked" });

  await db.insert(portfolioLikesTable).values({
    userId: req.user!.id,
    portfolioId: id,
  });

  return res.status(200).json({ success: true });
});

router.delete("/:id/like", requireAuth, async (req, res) => {
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

  const [like] = await db
    .select()
    .from(portfolioLikesTable)
    .where(
      and(
        eq(portfolioLikesTable.userId, req.user!.id),
        eq(portfolioLikesTable.portfolioId, id)
      )
    );

  if (!like)
    return res.status(400).json({ success: false, message: "Not liked" });

  await db
    .delete(portfolioLikesTable)
    .where(
      and(
        eq(portfolioLikesTable.userId, req.user!.id),
        eq(portfolioLikesTable.portfolioId, id)
      )
    );

  return res.status(200).json({ success: true });
});

export default router;
