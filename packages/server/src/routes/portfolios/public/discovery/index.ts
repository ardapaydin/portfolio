import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { portfolioTable } from "../../../../database";
import { and, eq, like } from "drizzle-orm";
import { QueryValidationMiddleware } from "../../../../helpers/middlewares/validation";
import z from "zod";
const router = express.Router();

router.get(
  "/discovery",
  requireAuth,
  (req, res, next) =>
    QueryValidationMiddleware(
      req,
      res,
      next,
      z.object({
        query: z.string().max(255).optional(),
        limit: z.int().max(16).optional().default(10),
        offset: z.int().optional().default(0),
      })
    ),
  async (req, res) => {
    const { query, limit, offset } = req.query;

    const portfolios = await db
      .select()
      .from(portfolioTable)
      .where(
        and(
          typeof query == "string"
            ? like(portfolioTable.name, query)
            : undefined,
          eq(portfolioTable.discoverable, true)
        )
      )
      .limit(Number(limit))
      .offset(Number(offset));

    return res.status(200).json(portfolios);
  }
);

export default router;
