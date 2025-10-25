import express from "express";
import { db } from "../../../../database/db";
import { connectionsTable, portfolioTable } from "../../../../database";
import { and, eq, or } from "drizzle-orm";
import modules from "../../../../helpers/data/modules";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import BodyValidationMiddleware from "../../../../helpers/middlewares/validation";
import { moduleConfigsTable } from "../../../../database/schemas/modules";
const router = express.Router();

router.get("/:idOrSubdomain/modules/:moduleId", async (req, res) => {
  const { idOrSubdomain, moduleId } = req.params;

  const [find] = await db
    .select()
    .from(portfolioTable)
    .where(
      or(
        eq(portfolioTable.id, idOrSubdomain),
        eq(portfolioTable.subdomain, idOrSubdomain)
      )
    );

  if (
    !find ||
    (find.id != idOrSubdomain &&
      !find.isPublished &&
      req.user?.id != find.userId)
  )
    return res
      .status(404)
      .json({ success: false, message: "portfolio not found" });

  if (isNaN(Number(moduleId)))
    return res
      .status(400)
      .json({ success: false, message: "invalid module id" });
  const r = modules.find((x) => x.id == Number(moduleId));
  if (!modules.find((x) => x.id == Number(moduleId)))
    return res
      .status(400)
      .json({ success: false, message: "module not found" });

  const data = JSON.parse(find.data as string);

  if (
    !data.modules?.find((x: number) => x == Number(moduleId)) &&
    req.user?.id != find.userId
  )
    return res.status(400).json({
      success: false,
      message: "this module is not supported on this portfolio",
    });

  if (r?.require.startsWith("oauth:")) {
    const [connection] = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.userId, find.userId),
          eq(connectionsTable.service, r.require.split("oauth:")[1])
        )
      );
    const jsoncon = JSON.parse(connection.serviceUser as string);
    const [config] = await db
      .select()
      .from(moduleConfigsTable)
      .where(
        and(
          eq(moduleConfigsTable.portfolioId, find.id),
          eq(moduleConfigsTable.moduleId, moduleId)
        )
      );
    return res.status(200).json({
      slug: jsoncon.slug,
      config: config ? JSON.parse(config.config as string) : r.config.default,
    });
  }
});

router.post("/:id/modules/:moduleId", requireAuth, async (req, res) => {
  const { id, moduleId } = req.params;
  const [find] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(eq(portfolioTable.id, id), eq(portfolioTable.userId, req.user!.id))
    );
  if (!find)
    return res.status(404).json({
      success: false,
      message: "portfolio not found or not created by this user",
    });

  const module = modules.find((x) => x.id == Number(moduleId));
  if (!module)
    return res
      .status(400)
      .json({ success: false, message: "module not found" });

  await BodyValidationMiddleware(req, res, () => {}, module.config.validation);
  if (res.headersSent) return;
  const [findconfig] = await db
    .select()
    .from(moduleConfigsTable)
    .where(
      and(
        eq(moduleConfigsTable.portfolioId, id),
        eq(moduleConfigsTable.moduleId, moduleId)
      )
    );

  if (findconfig)
    await db
      .update(moduleConfigsTable)
      .set({ config: req.body })
      .where(
        and(
          eq(moduleConfigsTable.portfolioId, id),
          eq(moduleConfigsTable.moduleId, moduleId)
        )
      );
  else
    await db.insert(moduleConfigsTable).values({
      config: req.body,
      portfolioId: id,
      moduleId,
    });

  return res.status(200).json({ success: true });
});

export default router;
