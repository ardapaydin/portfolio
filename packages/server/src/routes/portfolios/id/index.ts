import express from "express";
const router = express.Router();

import { requireAuth } from "../../../helpers/middlewares/auth";
import { portfolioTable } from "../../../database/schemas/portfolio";
import { db } from "../../../database/db";
import { and, eq } from "drizzle-orm";
import { draftsTable } from "../../../database";
import { editPortfolioSchema } from "../../../helpers/validations/portfolio/edit";
import BodyValidationMiddleware from "../../../helpers/middlewares/validation";
import deleteDomain from "../../../helpers/cloudflare/pages/deleteDomain";
import createDomain from "../../../helpers/cloudflare/pages/createDomain";

router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  let [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: "Portfolio not found or you do not have access to it",
    });
  }
  portfolio.data = JSON.parse(portfolio.data as any);
  res.json({ ...portfolio, data: JSON.parse(portfolio.data as any) });
});

router.put(
  "/:id",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, editPortfolioSchema),
  async (req, res) => {
    const { id } = req.params;
    const { subdomain, name } = req.body;

    let [portfolio] = await db
      .select()
      .from(portfolioTable)
      .where(
        and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
      );

    if (!portfolio)
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or you do not have access to it",
      });

    if (portfolio.subdomain != subdomain) {
      const [find] = await db
        .select()
        .from(portfolioTable)
        .where(eq(portfolioTable.subdomain, subdomain));

      if (find)
        return res.status(400).json({
          success: false,
          message: " subdomain already taken",
          errors: { subdomain: ["Subdomain already taken."] },
        });

      if (portfolio.isPublished) {
        deleteDomain(portfolio.subdomain + "." + process.env.DOMAIN);
        createDomain(subdomain + "." + process.env.DOMAIN);
      }
    }

    await db
      .update(portfolioTable)
      .set({
        subdomain,
        name,
      })
      .where(eq(portfolioTable.id, id));

    res.status(200).json({ success: true });
  }
);
router.post("/:id/save", requireAuth, async (req, res) => {
  const { id } = req.params;
  let [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );

  if (!portfolio)
    return res.status(404).json({
      success: false,
      message: "Portfolio not found or you do not have access to it",
    });

  const [draft] = await db
    .select()
    .from(draftsTable)
    .where(eq(draftsTable.portfolioId, id));
  if (draft)
    await db
      .update(portfolioTable)
      .set({
        data: draft.data,
      })
      .where(eq(portfolioTable.id, id));

  return res.status(200).json({ success: true });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );

  if (!portfolio)
    return res.status(404).json({
      success: false,
      message: "Portfolio not found or you do not have access to it",
    });

  if (portfolio.isPublished)
    deleteDomain(portfolio.subdomain + "." + process.env.DOMAIN);
  await db.delete(portfolioTable).where(eq(portfolioTable.id, id));
  return res.status(200).json({ success: true });
});

import DraftRouter from "./draft";
import AttachmentRouter from "./attachments";
import PublishRouter from "./publish";
router.use("/", DraftRouter);
router.use("/", AttachmentRouter);
router.use("/", PublishRouter);

export default router;
