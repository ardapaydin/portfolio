import express from "express";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { eventSchema } from "../../helpers/validations/event";
import { db } from "../../database/db";
import { portfolioTable } from "../../database";
import { eq } from "drizzle-orm";
import { eventsTable } from "../../database/schemas/event";
import { encryptIp } from "../../helpers/encryptions/ip";
const router = express.Router();

router.post(
  "/event",
  (req, res, next) => BodyValidationMiddleware(req, res, next, eventSchema),
  async (req, res) => {
    const {
      subdomain,
      data: { key, url, name },
      event: type,
    } = req.body;
    const [find] = await db
      .select()
      .from(portfolioTable)
      .where(eq(portfolioTable.subdomain, subdomain));
    const ip = (req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      "localhost") as string;
    let valid = false;

    const r = JSON.parse(find?.data as string);
    const typedKey = key as keyof typeof find;

    if (!key.startsWith("markdown-") && type == "clickLink") {
      const value = r?.[typedKey] as { name: string; url: string }[];
      if (!value?.find((x) => x.name == name && x.url == url))
        return res
          .status(400)
          .json({ success: false, message: "validation error" });
      valid = true;
    }
    if (key.startsWith("markdown-") && type == "clickLink") {
      const keyWithoutMd = key.split("markdown-")?.[1];
      if (!keyWithoutMd)
        return res
          .status(400)
          .json({ success: false, message: "validation error" });
      const value = r?.[keyWithoutMd] as string;

      const markdownLinks =
        (value || "").match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      const links = markdownLinks
        .map((link) => {
          const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          return match ? { name: match[1], url: match[2] } : {};
        })
        .filter((x) => x.name);
      if (!links.find((x) => x.name == name && x.url == url))
        return res
          .status(400)
          .json({ success: false, message: "validation error" });
      valid = true;
    }
    if (valid)
      await db.insert(eventsTable).values({
        portfolioId: find.id,
        type,
        ip: encryptIp(ip),
        data: {
          key,
          url,
          name,
        },
      });

    return res.status(200).json({});
  }
);

export default router;
