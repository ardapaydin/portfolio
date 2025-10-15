import express from "express";
const router = express.Router();

import { requireAuth } from "../../helpers/middlewares/auth";
import { portfolioTable } from "../../database/schemas/portfolio";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { createPortfolioSchema } from "../../helpers/validations/portfolio/create";
import { db } from "../../database/db";
import { and, eq } from "drizzle-orm";
import { portfolioTemplates } from "../../helpers/data/templates";

router.post(
  "/",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createPortfolioSchema),
  async (req, res) => {
    const { name, template } = req.body;
    const subdomain = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const [existing] = await db
      .select()
      .from(portfolioTable)
      .where(eq(portfolioTable.subdomain, subdomain))
      .limit(1);

    if (existing)
      return res.status(400).json({
        success: false,
        message: "subdomain already exists",
        errors: {
          name: ["A portfolio with this name already exists."],
        },
      });

    const userPortfolios = await db
      .select()
      .from(portfolioTable)
      .where(eq(portfolioTable.userId, req.user!.id));

    if (userPortfolios.length >= 3)
      return res.status(400).json({
        success: false,
        message: "user has reached the maximum number of portfolios",
        errors: {
          name: ["You can only have up to 3 portfolios."],
        },
      });

    const newPortfolio = await db
      .insert(portfolioTable)
      .values({
        userId: req.user!.id,
        name,
        subdomain,
        template,
        data: portfolioTemplates.find((t) => t.id === template)?.data?.default,
      })
      .$returningId();

    res.json({ success: true, portfolio: newPortfolio[0] });
  }
);

router.get("/", requireAuth, async (req, res) => {
  let portfolios = await db
    .select({
      id: portfolioTable.id,
      name: portfolioTable.name,
      subdomain: portfolioTable.subdomain,
      template: portfolioTable.template,
    })
    .from(portfolioTable)
    .where(eq(portfolioTable.userId, req.user!.id));

  portfolios = portfolios.filter((p) =>
    portfolioTemplates.find((t) => t.id === p.template)
  );

  res.json(portfolios);
});

router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [portfolio] = await db
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

  res.json(portfolio);
});

export default router;
