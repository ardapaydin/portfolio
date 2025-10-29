import express from "express";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { loginSchema } from "../../helpers/validations/auth/login";
import { registerSchema } from "../../helpers/validations/auth/register";
import { db } from "../../database/db";
import {
  connectionsTable,
  devicesTable,
  emailVerificationTable,
  twoFactorAuthenticationTable,
  usersTable,
} from "../../database";
import { eq } from "drizzle-orm";
import {
  ComparePassword,
  EncryptPassword,
} from "../../helpers/encryptions/password";
import { signToken } from "../../helpers/jwt";
import { createToken } from "../../helpers/email/verification";
import { requireNoAuth } from "../../helpers/middlewares/auth";
import resetpasswordrouter from "./resetpassword";
import { validateTwoFA } from "../../helpers/utils/validateTwoFA";
const router = express.Router();

router.get("/me", async (req, res) => {
  if (!req.user) return res.json({});
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      profilePicture: usersTable.profilePicture,
      name: usersTable.name,
      emailVerified: usersTable.emailVerified,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id));

  let connections = await db
    .select()
    .from(connectionsTable)
    .where(eq(connectionsTable.userId, req.user.id));

  const [twofa] = await db
    .select({
      verified: twoFactorAuthenticationTable.verified,
    })
    .from(twoFactorAuthenticationTable)
    .where(eq(twoFactorAuthenticationTable.userId, user.id));

  const devices = await db
    .select({
      id: devicesTable.id,
      name: devicesTable.name,
    })
    .from(devicesTable)
    .where(eq(devicesTable.userId, user.id));

  res.json({
    user,
    connections: connections.map((x) => {
      return {
        ...x,
        accessToken: undefined,
        serviceUser: JSON.parse(x.serviceUser as string),
      };
    }),
    twoFactor: twofa || false,
    devices,
  });
});

router.post(
  "/login",
  requireNoAuth,
  (req, res, next) => BodyValidationMiddleware(req, res, next, loginSchema),
  async (req, res) => {
    const { email, password, twoFactorType, code: twoFactorCode } = req.body;

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

    const twoFa = await validateTwoFA(user.id, twoFactorType, twoFactorCode);
    if (!twoFa?.success) return res.status(400).json(twoFa);

    res.json({
      success: true,
      data: { id: user.id, token: signToken(user.id) },
    });
  }
);

router.post(
  "/register",
  requireNoAuth,
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
        message: "email already exists",
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

router.post("/verify-email", async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  const [encoded] = token.split(".");
  const decoded = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
  const [record] = await db
    .select()
    .from(emailVerificationTable)
    .where(eq(emailVerificationTable.token, token));
  if (!record)
    return res.status(400).json({ success: false, message: "Invalid token" });
  const { email } = decoded;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user)
    return res.status(400).json({ success: false, message: "Invalid token" });

  await db
    .update(usersTable)
    .set({ emailVerified: true })
    .where(eq(usersTable.email, email));

  await db
    .delete(emailVerificationTable)
    .where(eq(emailVerificationTable.token, token));
  res.json({ success: true });
});
router.use(resetpasswordrouter);

export default router;
