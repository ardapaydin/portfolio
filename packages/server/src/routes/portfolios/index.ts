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
    let subdomain = createSubdomain();
    const [{ emailVerified }] = await db
      .select({ emailVerified: usersTable.emailVerified })
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id));
    if (!emailVerified)
      return res.status(400).json({
        success: false,
        message: "email is not verified",
        errors: {
          name: ["You must verify your email before creating a portfolio"],
        },
      });

    const userPortfolios = await db
      .select()
      .from(portfolioTable)
      .where(eq(portfolioTable.userId, req.user!.id));

    if (userPortfolios.length >= 6)
      return res.status(400).json({
        success: false,
        message: "user has reached the maximum number of portfolios",
        errors: {
          name: ["You can only have up to 6 portfolios."],
        },
      });

    const [newPortfolio] = await db
      .insert(portfolioTable)
      .values({
        userId: req.user!.id,
        name,
        subdomain,
        template,
        data: portfolioTemplates.find((t) => t.id === template)?.data?.default,
      })
      .$returningId();

    res.json({ success: true, portfolio: newPortfolio });
  }
);

router.get("/", requireAuth, async (req, res) => {
  let portfolios = await db
    .select({
      id: portfolioTable.id,
      name: portfolioTable.name,
      subdomain: portfolioTable.subdomain,
      template: portfolioTable.template,
      isPublished: portfolioTable.isPublished,
    })
    .from(portfolioTable)
    .where(eq(portfolioTable.userId, req.user!.id));

  portfolios = portfolios.filter((p) =>
    portfolioTemplates.find((t) => t.id === p.template)
  );

  res.json(portfolios);
});

import idRouter from "./id";
import createSubdomain from "../../helpers/utils/createSubdomain";
import { usersTable } from "../../database";
router.use(idRouter);

export default router;
