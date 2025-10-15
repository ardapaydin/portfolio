import express from "express";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { loginSchema } from "../../helpers/validations/auth/login";
import { registerSchema } from "../../helpers/validations/auth/register";
import { db } from "../../database/db";
import { usersTable } from "../../database";
import { eq } from "drizzle-orm";
import {
  ComparePassword,
  EncryptPassword,
} from "../../helpers/encryptions/password";
import { signToken } from "../../helpers/jwt";
import { createToken } from "../../helpers/email/verification";
const router = express.Router();

router.post(
  "/login",
  (req, res, next) => BodyValidationMiddleware(req, res, next, loginSchema),
  async (req, res) => {
    const { email, password } = req.body;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user)
      return res.status(400).json({
        success: false,
        message: "email or password is incorrect",
        errors: {
          email: ["Email or password is incorrect."],
        },
      });

    if (!ComparePassword(password, user.password))
      return res.status(400).json({
        success: false,
        message: "email or password is incorrect",
        errors: {
          email: ["Email or password is incorrect."],
        },
      });
    if (!user.emailVerified)
      return res.status(400).json({
        success: false,
        message: "email not verified",
        errors: {
          email: ["Please verify your email before logging in."],
        },
      });
    res.json({
      success: true,
      data: { id: user.id, token: signToken(user.id) },
    });
  }
);

router.post(
  "/register",
  (req, res, next) => BodyValidationMiddleware(req, res, next, registerSchema),
  async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "email already exits",
        errors: {
          email: ["This email is already registered."],
        },
      });

    const [user] = await db
      .insert(usersTable)
      .values({
        email,
        password: EncryptPassword(password),
        name: `${firstName || ""} ${lastName || ""}`.trim() || null,
      })
      .$returningId();
    await createToken(email);
    res.json({ success: true, data: { id: user.id } });
  }
);

export default router;
