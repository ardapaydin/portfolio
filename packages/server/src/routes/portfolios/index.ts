import express from "express";
const router = express.Router();

import { usersTable } from "../../database";
import { requireAuth } from "../../helpers/middlewares/auth";
import { portfolioTable } from "../../database/schemas/portfolio";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { createPortfolioSchema } from "../../helpers/validations/portfolio/create";
import { db } from "../../database/db";
import { eq, or } from "drizzle-orm";
import { portfolioTemplates } from "../../helpers/data/templates";
import createSubdomain from "../../helpers/utils/createSubdomain";

router.post(
  "/",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createPortfolioSchema),
  async (req, res) => {
    const { name, template, subdomain: sd } = req.body;
    let subdomain = sd || createSubdomain();
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

    const [findsubdomain] = await db
      .select()
      .from(portfolioTable)
      .where(
        or(
          eq(portfolioTable.subdomain, subdomain),
          eq(portfolioTable.id, subdomain)
        )
      );
    if (findsubdomain)
      return res.status(400).json({
        success: false,
        message: "subdomain is taken",
        errors: {
          subdomain: ["Subdomain already taken."],
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
      discoverable: portfolioTable.discoverable,
    })
    .from(portfolioTable)
    .where(eq(portfolioTable.userId, req.user!.id));

  portfolios = portfolios.filter((p) =>
    portfolioTemplates.find((t) => t.id === p.template)
  );

  res.json(portfolios);
});

import publicRouter from "./public";
import idRouter from "./id";
router.use(publicRouter);
router.use(idRouter);

export default router;
