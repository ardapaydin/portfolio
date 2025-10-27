import express from "express";
const router = express.Router();

import AuthRouter from "./auth";
import PortfoliosRouter from "./portfolios";
import TemplatesRouter from "./templates";
import AttachmentsRouter from "./attachments";
import ConnectionsRouter from "./connections";
import UserRouter from "./user";
import EventRouter from "./event";
import ModulesRouter from "./modules";
import { verifyToken } from "../helpers/jwt";
import { db } from "../database/db";
import { count, eq } from "drizzle-orm";
import { usersTable } from "../database";
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const { id } = verifyToken(authHeader.split(" ")[1]);
      const [{ value }] = await db
        .select({ value: count() })
        .from(usersTable)
        .where(eq(usersTable.id, id));
      if (!value) return next();
      res.setHeader("X-User-Id", id);
      req.user = { id };
    } catch (err) {}
  }

  next();
});

router.use("/auth", AuthRouter);
router.use("/portfolios", PortfoliosRouter);
router.use("/templates", TemplatesRouter);
router.use("/attachments", AttachmentsRouter);
router.use("/connections", ConnectionsRouter);
router.use("/modules", ModulesRouter);
router.use("/user", UserRouter);
router.use("/data", EventRouter);

export default router;
