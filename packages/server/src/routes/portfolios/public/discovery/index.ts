import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { portfolioTable, usersTable } from "../../../../database";
import { and, eq, like, count } from "drizzle-orm";
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
        limit: z.preprocess(
          (val) => Number(val),
          z.number().max(16).optional().default(10)
        ),
        page: z.preprocess(
          (val) => Number(val),
          z.number().optional().default(1)
        ),
      })
    ),
  async (req, res) => {
    const { query, limit, page } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const [{ total }] = await db
      .select({ total: count(portfolioTable.id) })
      .from(portfolioTable)
      .where(
        and(
          query && typeof query === "string"
            ? like(portfolioTable.name, `%${query}%`)
            : undefined,
          eq(portfolioTable.discoverable, true),
          eq(portfolioTable.isPublished, true)
        )
      );

    const portfolios = await db
      .select({
        name: portfolioTable.name,
        template: portfolioTable.template,
        subdomain: portfolioTable.subdomain,
        createdBy: {
          name: usersTable.name,
          profilePicture: usersTable.profilePicture,
        },
        createdAt: portfolioTable.createdAt,
        updated: portfolioTable.updatedAt,
      })
      .from(portfolioTable)
      .where(
        and(
          query && typeof query === "string"
            ? like(portfolioTable.name, `%${query}%`)
            : undefined,
          eq(portfolioTable.discoverable, true),
          eq(portfolioTable.isPublished, true)
        )
      )
      .leftJoin(usersTable, eq(usersTable.id, portfolioTable.userId))
      .limit(Number(limit))
      .offset(offset);

    return res.status(200).json({
      data: portfolios,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

export default router;
