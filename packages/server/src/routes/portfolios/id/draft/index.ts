import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { connectionsTable, portfolioTable } from "../../../../database";
import { and, eq } from "drizzle-orm";
import { draftsTable } from "../../../../database/schemas/drafts";
import { portfolioTemplates } from "../../../../helpers/data/templates";
import BodyValidationMiddleware from "../../../../helpers/middlewares/validation";
import modules from "../../../../helpers/data/modules";
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
  if (req.body.modules) {
    const f = req.body.modules.filter((x: number) =>
      template?.supportedModules.includes(x as never)
    );
    if (req.body.modules.length != f.length)
      return res.status(400).json({
        success: false,
        message: "unsupported module for this template",
      });

    for (const x of req.body.modules) {
      const module = modules.find((m) => m.id === x);
      if (module?.require.startsWith("oauth")) {
        const s = module.require.split("oauth:")[1];
        const [connection] = await db
          .select()
          .from(connectionsTable)
          .where(
            and(
              eq(connectionsTable.userId, req.user!.id),
              eq(connectionsTable.service, s)
            )
          );
        if (!connection)
          return res.status(400).json({
            success: false,
            message: s + " oauth required for " + module.name,
          });
      }
    }
  }
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
