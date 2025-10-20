import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import {
  analyticsTable,
  portfolioTable,
  usersTable,
} from "../../../../database";
import { and, desc, eq, gte } from "drizzle-orm";
import getDomain from "../../../../helpers/cloudflare/pages/getDomain";
import createDomain from "../../../../helpers/cloudflare/pages/createDomain";

const router = express.Router();

router.get("/:id/analytics", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [find] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );
  if (!find)
    return res.status(404).json({
      success: false,
      message: "portfolio not found or not created by user",
    });

  const from = req.query.from ? new Date(req.query.from as string) : undefined;
  const to = req.query.to ? new Date(req.query.to as string) : undefined;

  if (from && isNaN(from.getTime()))
    return res.status(400).json({
      success: false,
      message: "Invalid 'from' date provided",
    });
  if (to && isNaN(to.getTime()))
    return res.status(400).json({
      success: false,
      message: "Invalid 'to' date provided",
    });

  const c = [
    eq(analyticsTable.portfolioId, id),
    from ? gte(analyticsTable.date, from) : undefined,
    to ? gte(analyticsTable.date, to) : undefined,
  ].filter(Boolean);

  console.log(c);

  const data = await db
    .select()
    .from(analyticsTable)
    .where(and(...c))
    .orderBy(desc(analyticsTable.date));

  res.json({
    totalViews: data.reduce((acc, d) => acc + d.views, 0),
    totalUnique: data.reduce((acc, d) => acc + d.uniqueVisitors, 0),
    daily: data.map((d) => ({
      date: d.date,
      views: d.views,
      unique: d.uniqueVisitors,
    })),
  });
});

export default router;
