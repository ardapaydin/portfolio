import express from "express";
import { requireAuth } from "../../../helpers/middlewares/auth";
import { db } from "../../../database/db";
import { attachmentsTable, portfolioTable } from "../../../database";
import { and, eq } from "drizzle-orm";
const router = express.Router();

router.get("/:id/attachments", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, message: "No id specified" });

  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );

  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "portfolio not found or inaccessible" });

  const attachments = await db
    .select()
    .from(attachmentsTable)
    .where(eq(attachmentsTable.relatedPortfolioId, id));

  return res.status(200).json(attachments);
});

export default router;
