import express from "express";
import { db } from "../../../../database/db";
import { connectionsTable, portfolioTable } from "../../../../database";
import { and, eq, or } from "drizzle-orm";
import modules from "../../../../helpers/data/modules";
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

    return res.status(200).json({
      slug: jsoncon.slug,
    });
  }
});

export default router;
