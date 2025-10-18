import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { portfolioTable } from "../../../../database";
import { eq } from "drizzle-orm";
const router = express.Router();

router.post("/:id/publish", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(eq(portfolioTable.id, id));
  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "Portfolio not found" });
  if (portfolio.userId !== req.user!.id)
    return res.status(403).json({
      success: false,
      message: "You do not have access to this portfolio",
    });
});

export default router;
