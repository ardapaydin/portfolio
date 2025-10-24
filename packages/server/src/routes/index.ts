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

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const { id } = verifyToken(authHeader.split(" ")[1]);
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
