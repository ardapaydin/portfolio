import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { analyticsTable, portfolioTable } from "../../../../database";
import { and, asc, eq, gte, lte } from "drizzle-orm";

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
      errors: { from: ["from must be a valid date."] },
    });
  if (to && isNaN(to.getTime()))
    return res.status(400).json({
      success: false,
      message: "Invalid 'to' date provided",
      errors: { to: ["to must be a valid date."] },
    });

  if (from && to && to < from)
    return res.status(400).json({
      success: false,
      message: "invalid to",
      errors: { to: ["to cannot be earlier than from"] },
    });

  const data = await db
    .select()
    .from(analyticsTable)
    .where(
      and(
        eq(analyticsTable.portfolioId, id),
        from ? gte(analyticsTable.date, from) : undefined,
        to ? lte(analyticsTable.date, to) : undefined
      )
    )
    .orderBy(asc(analyticsTable.date));

  res.json({
    totalViews: data.reduce((acc, d) => acc + d.views, 0),
    totalUnique: data.reduce((acc, d) => acc + d.uniqueVisitors, 0),
    daily: data.map((d) => ({
      date: `${new Date(d.date).getFullYear()}-${(
        new Date(d.date).getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${new Date(d.date)
        .getDate()
        .toString()
        .padStart(2, "0")}`,
      views: d.views,
      unique: d.uniqueVisitors,
    })),
  });
});

export default router;
