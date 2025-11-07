import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { blogTable, portfolioTable } from "../../../../database";
import { and, eq } from "drizzle-orm";
const router = express.Router();

router.post("/:id/blog/:blogId", requireAuth, async (req, res) => {
  const { id, blogId } = req.params;

  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.userId, req.user!.id), eq(portfolioTable.id, id))
    );

  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "Portfolio not found." });

  const [blog] = await db
    .select()
    .from(blogTable)
    .where(and(eq(blogTable.id, blogId), eq(blogTable.userId, req.user!.id)));

  if (!blog)
    return res.status(404).json({ success: false, message: "Blog not found." });

  await db
    .update(portfolioTable)
    .set({ blogId })
    .where(eq(portfolioTable.id, id));

  return res.status(200).json({ success: true });
});

router.delete("/:id/blog", requireAuth, async (req, res) => {
  const { id } = req.params;

  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );

  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "Portfolio not found." });

  if (!portfolio.blogId)
    return res.status(400).json({
      success: false,
      message: "this portfolio is not connected to a blog",
    });

  return res.status(200).json({ success: true });
});

export default router;
