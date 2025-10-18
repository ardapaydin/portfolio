import express from "express";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { db } from "../../../../database/db";
import { portfolioTable } from "../../../../database";
import { eq } from "drizzle-orm";
import getDomain from "../../../../helpers/cloudflare/pages/getDomain";
import createDomain from "../../../../helpers/cloudflare/pages/createDomain";

const router = express.Router();

router.post("/:id/publish", requireAuth, async (req, res) => {
  const { id } = req.params;
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(eq(portfolioTable.id, id));
  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "Portfolio not found" });
  if (portfolio.userId !== req.user!.id)
    return res.status(403).json({
      success: false,
      message: "You do not have access to this portfolio",
    });
  const domain = portfolio.subdomain + "." + process.env.DOMAIN;
  const domainSetup = await getDomain(domain);

  if (!domainSetup.result) {
    const r = await createDomain(domain);

    if (!r.success)
      return res
        .status(500)
        .json({ success: false, message: "domain request error" });
  }

  await db
    .update(portfolioTable)
    .set({ isPublished: true })
    .where(eq(portfolioTable.id, id));

  return res.status(200).json({ success: true });
});

router.get("/:id/state", async (req, res) => {
  const { id } = req.params;
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(eq(portfolioTable.id, id));
  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "Portfolio not found" });
  if (portfolio.userId !== req.user!.id)
    return res.status(403).json({
      success: false,
      message: "You do not have access to this portfolio",
    });
  if (!portfolio.isPublished)
    return res
      .status(400)
      .json({ success: false, message: "portfolio is not published" });

  const domain = portfolio.subdomain + "." + process.env.DOMAIN;
  const active = await getDomain(domain);
  return res.json({
    status: active.result.validation_data.status,
    method: active.result.validation_data.method,
  });
});

export default router;
