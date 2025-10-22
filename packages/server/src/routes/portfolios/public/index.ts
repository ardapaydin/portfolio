import express from "express";
const router = express.Router();

import { portfolioTable } from "../../../database/schemas/portfolio";
import { db } from "../../../database/db";
import { and, eq, sql } from "drizzle-orm";
import {
  analyticsIpsTable,
  analyticsTable,
  averageTimeTable,
} from "../../../database";
import { encryptIp } from "../../../helpers/encryptions/ip";
import expressWs, { Application } from "express-ws";
expressWs(router as Application);

router.get("/view/:subdomain", async (req, res) => {
  const { subdomain } = req.params;
  const [find] = await db
    .select({
      id: portfolioTable.id,
      data: portfolioTable.data,
      t: portfolioTable.template,
    })
    .from(portfolioTable)
    .where(
      and(
        eq(portfolioTable.subdomain, subdomain),
        eq(portfolioTable.isPublished, true)
      )
    );

  if (!find)
    return res.status(404).json({
      success: false,
      message: "portfolio not found or not published yet",
    });
  const ip = (req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    "localhost") as string;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [existingIp] = await db
    .select()
    .from(analyticsIpsTable)
    .where(
      and(
        eq(analyticsIpsTable.date, date),
        eq(analyticsIpsTable.ip, encryptIp(ip))
      )
    );
  if (!existingIp)
    await db.insert(analyticsIpsTable).values({
      ip: encryptIp(ip),
      date,
      portfolioId: find.id,
    });

  await db
    .insert(analyticsTable)
    .values({
      portfolioId: find.id,
      date,
      views: 1,
      uniqueVisitors: !existingIp ? 1 : 0,
    })
    .onDuplicateKeyUpdate({
      set: {
        views: sql`${analyticsTable.views} + 1`,
        uniqueVisitors: !existingIp
          ? sql`${analyticsTable.uniqueVisitors} + 1`
          : undefined,
      },
    });

  return res
    .status(200)
    .json({ template: find.t, data: JSON.parse(find.data as string) });
});

router.ws("/ws/:subdomain", async (ws, req) => {
  const { subdomain } = req.params;
  const [find] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(
        eq(portfolioTable.subdomain, subdomain),
        eq(portfolioTable.isPublished, true)
      )
    );
  if (!find) return ws.close(4000, "Portfolio not found.");
  ws.send(
    JSON.stringify({
      type: "welcome",
    })
  );
  const connectedAt = Date.now();
  let lastHeartbeat = Date.now();
  const ip = (req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    "localhost") as string;

  const heartbeatInterval = setInterval(() => {
    if (ws.readyState !== ws.OPEN) return clearInterval(heartbeatInterval);

    if (Date.now() - lastHeartbeat > 120000) ws.close(4002, "timeout");
  }, 25000);
  ws.on("message", async (m: string) => {
    const data = JSON.parse(m);
    switch (data.type) {
      case "heartbeat": {
        lastHeartbeat = Date.now();
        ws.send(JSON.stringify({ type: "ok" }));
        break;
      }
      default: {
        ws.close(4001, "invalid type");
        break;
      }
    }
  });

  ws.on("close", async () => {
    let x = Math.floor((Date.now() - connectedAt) / 1000);
    if (!x) return;
    await db.insert(averageTimeTable).values({
      ip: encryptIp(ip),
      relatedPortfolioId: find.id,
      duration: Math.floor((Date.now() - connectedAt) / 1000),
    });
  });
});
export default router;
