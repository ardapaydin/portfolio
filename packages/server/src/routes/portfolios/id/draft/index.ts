import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { portfolioTable } from "../../../../database";
import { eq } from "drizzle-orm";
import { draftsTable } from "../../../../database/schemas/drafts";
import { portfolioTemplates } from "../../../../helpers/data/templates";
import BodyValidationMiddleware from "../../../../helpers/middlewares/validation";
const router = express.Router();

router.post("/:id/draft", requireAuth, async (req, res) => {
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

  const template = portfolioTemplates.find((t) => t.id === portfolio.template);

  const validate = template?.data?.validation!;
  await BodyValidationMiddleware(req, res, () => {}, validate);
  if (res.headersSent) return;

  const [existingDraft] = await db
    .select()
    .from(draftsTable)
    .where(eq(draftsTable.portfolioId, id));
  if (existingDraft)
    await db
      .update(draftsTable)
      .set({ data: req.body })
      .where(eq(draftsTable.id, existingDraft.id));
  else await db.insert(draftsTable).values({ portfolioId: id, data: req.body });

  return res.status(200).json({
    draftId: existingDraft ? existingDraft.id : undefined,
  });
});

router.get("/:id/draft", requireAuth, async (req, res) => {
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

  let [draft] = await db
    .select()
    .from(draftsTable)
    .where(eq(draftsTable.portfolioId, id));
  if (!draft)
    return res.status(404).json({ success: false, message: "Draft not found" });
  draft.data = JSON.parse(draft.data as any);
  return res.status(200).json(draft);
});

router.delete("/:id/draft", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(eq(portfolioTable.id, id));
  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "portfolio not found" });

  if (portfolio.userId !== req.user!.id)
    return res.status(403).json({
      success: false,
      message: "You do not have access to this portfolio",
    });

  let [draft] = await db
    .select()
    .from(draftsTable)
    .where(eq(draftsTable.portfolioId, id));

  if (!draft) return res.status(204).json();
  await db.delete(draftsTable).where(eq(draftsTable.portfolioId, id));

  return res.status(204).json();
});

export default router;
