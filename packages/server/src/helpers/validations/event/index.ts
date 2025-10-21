import z from "zod";
import { db } from "../../../database/db";
import { portfolioTable } from "../../../database";
import { and, eq } from "drizzle-orm";

const events = {
  clickLink: z.object({
    key: z.string(),
    url: z.url(),
  }),
};

export const eventSchema = z
  .object({
    subdomain: z.string("Subdomain must be string").refine(async (arg) => {
      const [find] = await db
        .select()
        .from(portfolioTable)
        .where(
          and(
            eq(portfolioTable.subdomain, arg),
            eq(portfolioTable.isPublished, true)
          )
        );

      return !!find;
    }, "Portfolio not found"),
    event: z.enum(["clickLink"], "invalid event typr"),
    data: z.any(),
    timestamp: z.int().optional().default(Math.floor(Date.now())),
  })
  .superRefine((val, ctx) => {
    const result = events[val.event].safeParse(val.data);

    if (!result.success) {
      for (const issue of result.error.issues)
        ctx.addIssue({
          code: "custom",
          message: issue.message,
          path: ["data", ...issue.path],
        });
    }
  });
