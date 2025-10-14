import express from "express";
const router = express.Router();

import AuthRouter from "./auth";
import { verifyToken } from "../helpers/jwt";

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const userId = verifyToken(authHeader.split(" ")[1]);
    res.setHeader("X-User-Id", userId.id);
    req.user = { id: parseInt(userId.id) };
  }

  next();
});

router.use("/auth", AuthRouter);

export default router;
