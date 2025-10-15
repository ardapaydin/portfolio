import express from "express";
const router = express.Router();

import AuthRouter from "./auth";
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

export default router;
