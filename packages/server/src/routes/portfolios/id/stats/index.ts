import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import {
  analyticsTable,
  averageTimeTable,
  eventsTable,
  portfolioTable,
} from "../../../../database";
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

  const times = await db
    .select()
    .from(averageTimeTable)
    .where(
      and(
        eq(averageTimeTable.relatedPortfolioId, id),
        from ? gte(averageTimeTable.createdAt, from) : undefined,
        to ? lte(averageTimeTable.createdAt, to) : undefined
      )
    )
    .orderBy(asc(averageTimeTable.createdAt));

  const durations = times.map((t) => t.duration);

  res.json({
    totalViews: data.reduce((acc, d) => acc + d.views, 0),
    totalUnique: data.reduce((acc, d) => acc + d.uniqueVisitors, 0),
    averageDuration: Math.floor(
      durations.reduce((acc, v) => acc + v, 0) / durations.length
    ),
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

router.get("/:id/event-analytics", requireAuth, async (req, res) => {
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

  const { event } = req.query;
  const from = req.query.from ? new Date(req.query.from as string) : undefined;
  const to = req.query.to ? new Date(req.query.to as string) : undefined;

  if (!event)
    return res.status(400).json({
      success: false,
      message: "invalid event",
      errors: { event: ["Event must be provided."] },
    });

  if (!["clickLink"].includes(event as string))
    return res.status(400).json({
      success: false,
      message: "invalid event",
      errors: { event: ["Invalid event provided."] },
    });

  if (!from || isNaN(from.getTime()))
    return res.status(400).json({
      success: false,
      message: "Invalid 'from' date provided",
      errors: { from: ["from must be a valid date."] },
    });
  if (!to || isNaN(to.getTime()))
    return res.status(400).json({
      success: false,
      message: "Invalid 'to' date provided",
      errors: { to: ["to must be a valid date."] },
    });
  if (to < from)
    return res.status(400).json({
      success: false,
      message: "invalid to",
      errors: { to: ["to cannot be earlier than from"] },
    });

  let data = await db
    .select()
    .from(eventsTable)
    .where(
      and(
        eq(eventsTable.type, event as string),
        gte(eventsTable.createdAt, from),
        lte(eventsTable.createdAt, to)
      )
    );
  data = data.map((x) => ({ ...x, data: JSON.parse(x.data as string) }));
  let response: { key: string; url: string; name: string; count: number }[] =
    [];
  data.forEach((x) => {
    const eventData = x.data as { key: string; url: string; name: string };
    let existing = response.find((r) => r.key === eventData.key);
    if (!existing)
      response.push({
        key: eventData.key,
        url: eventData.url,
        name: eventData.name,
        count: 1,
      });
    else existing.count += 1;
  });

  response = response.sort((a, b) => b.count - a.count);
  return res.json(response);
});
export default router;
