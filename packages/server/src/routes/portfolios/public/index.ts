import express from "express";
const router = express.Router();

import { requireAuth } from "../../../helpers/middlewares/auth";
import { portfolioTable } from "../../../database/schemas/portfolio";
import { db } from "../../../database/db";
import { and, eq } from "drizzle-orm";
import { draftsTable } from "../../../database";
import { editPortfolioSchema } from "../../../helpers/validations/portfolio/edit";
import BodyValidationMiddleware from "../../../helpers/middlewares/validation";
import deleteDomain from "../../../helpers/cloudflare/pages/deleteDomain";
import createDomain from "../../../helpers/cloudflare/pages/createDomain";

router.get("/view/:subdomain", async (req, res) => {
  const { subdomain } = req.params;
  const [find] = await db
    .select({ data: portfolioTable.data, t: portfolioTable.template })
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

  return res
    .status(200)
    .json({ template: find.t, data: JSON.parse(find.data as string) });
});

export default router;
