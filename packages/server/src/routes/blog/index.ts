import express from "express";
import { requireAuth } from "../../helpers/middlewares/auth";
import { db } from "../../database/db";
import { blogTable } from "../../database/schemas/blog";
import { count, eq } from "drizzle-orm";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { createBlogSchema } from "../../helpers/validations/blog/create";
import idRouter from "./id";
const router = express.Router();

router.post(
  "/",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, createBlogSchema),
  async (req, res) => {
    const [total] = await db
      .select({ count: count() })
      .from(blogTable)
      .where(eq(blogTable.userId, req.user!.id));
    if (total.count >= 5)
      return res.status(400).json({
        success: false,
        message: "reached limit",
        errors: {
          name: [
            "You have already created the maximum number of blogs (5) allowed for your account",
          ],
        },
      });

    const { name } = req.body;

    const [insert] = await db
      .insert(blogTable)
      .values({
        userId: req.user!.id,
        name,
      })
      .$returningId();

    return res.status(200).json({ success: true, data: { id: insert.id } });
  }
);

router.use(idRouter);

export default router;
