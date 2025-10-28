import express from "express";
import { requireAuth } from "../../../helpers/middlewares/auth";
import { db } from "../../../database/db";
import {
  backupCodesTable,
  twoFactorAuthenticationTable,
  usersTable,
} from "../../../database";
import { and, eq } from "drizzle-orm";
import speakeasy from "speakeasy";
import { toDataURL } from "qrcode";
import BodyValidationMiddleware from "../../../helpers/middlewares/validation";
import { twoFactorVerifySchema } from "../../../helpers/validations/user/2fa/verify";
import createBackupCodes from "../../../helpers/utils/createBackupCodes";
import { validateTwoFA } from "../../../helpers/utils/validateTwoFA";
import { newBackupCodesSchema } from "../../../helpers/validations/user/2fa/backupCodes";
const router = express.Router();

router.post("/setup", requireAuth, async (req, res) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.id));

  if (!user.emailVerified)
    return res
      .status(400)
      .json({ success: false, message: "Email is not verified" });

  const [twoFa] = await db
    .select()
    .from(twoFactorAuthenticationTable)
    .where(eq(twoFactorAuthenticationTable.userId, user.id));
  let secret;
  if (!twoFa) {
    let { base32 } = speakeasy.generateSecret({
      name: `${process.env.APP_NAME} (${user.email})`,
      issuer: process.env.APP_NAME,
    });

    await db.insert(twoFactorAuthenticationTable).values({
      userId: user.id,
      secret: base32,
    });
    secret = base32;
  } else secret = twoFa.secret;

  const qr = await toDataURL(
    `otpauth://totp/${process.env.APP_NAME}:${user.email}?secret=${secret}&issuer=${process.env.APP_NAME}`,
    {
      errorCorrectionLevel: "H",
      width: 400,
      margin: 1,
    }
  );

  return res.status(200).json({
    success: true,
    qr,
    secret,
  });
});

router.post(
  "/verify",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, twoFactorVerifySchema),
  async (req, res) => {
    const { code } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id));

    if (!user.emailVerified)
      return res
        .status(400)
        .json({ success: false, message: "Email is not verified" });

    const [twoFa] = await db
      .select()
      .from(twoFactorAuthenticationTable)
      .where(eq(twoFactorAuthenticationTable.userId, user.id));

    if (!twoFa)
      return res.status(400).json({
        success: false,
        message: "Invalid code",
        errors: { code: ["Invalid code"] },
      });

    if (twoFa.verified)
      return res
        .status(400)
        .json({ success: false, message: "Already verified." });

    const verify = speakeasy.totp.verify({
      secret: twoFa.secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verify)
      return res.status(400).json({
        success: false,
        message: "Invalid code",
        errors: { code: ["Invalid code"] },
      });

    await db
      .update(twoFactorAuthenticationTable)
      .set({
        verified: true,
      })
      .where(eq(twoFactorAuthenticationTable.userId, user.id));

    const codes = createBackupCodes();
    for (let code of codes)
      await db.insert(backupCodesTable).values({
        key: code,
        userId: user.id,
        usedAt: null,
      });

    return res.status(200).json({
      success: true,
      codes,
    });
  }
);

router.post(
  "/disable",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, twoFactorVerifySchema),
  async (req, res) => {
    const [find] = await db
      .select()
      .from(twoFactorAuthenticationTable)
      .where(
        and(
          eq(twoFactorAuthenticationTable.userId, req.user!.id),
          eq(twoFactorAuthenticationTable.verified, true)
        )
      );

    if (!find)
      return res.status(400).json({ success: false, message: "not enabled" });

    const { code } = req.body;

    const twoFa = await validateTwoFA(req.user!.id, "app", code);

    if (!twoFa?.success)
      return res.status(400).json({
        success: false,
        message: "Invalid code",
        errors: twoFa?.errors,
      });

    await db
      .delete(twoFactorAuthenticationTable)
      .where(eq(twoFactorAuthenticationTable.id, find.id));
    await db
      .delete(backupCodesTable)
      .where(eq(backupCodesTable.userId, req.user!.id));
    return res.status(200).json({ success: true });
  }
);

router.post(
  "/backup-codes",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, newBackupCodesSchema),
  async (req, res) => {
    const [find] = await db
      .select()
      .from(twoFactorAuthenticationTable)
      .where(
        and(
          eq(twoFactorAuthenticationTable.userId, req.user!.id),
          eq(twoFactorAuthenticationTable.verified, true)
        )
      );

    if (!find)
      return res.status(400).json({
        success: false,
        message: "Two factor authentication is not enabled",
      });
    const { code: twoFactorCode, twoFactorType } = req.body;
    const verify = await validateTwoFA(
      req.user!.id,
      twoFactorType,
      twoFactorCode,
      ["app"]
    );

    if (!verify?.success)
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        errors: verify?.errors,
      });

    await db
      .delete(backupCodesTable)
      .where(eq(backupCodesTable.userId, req.user!.id));

    const generate = createBackupCodes();

    await db.insert(backupCodesTable).values(
      generate.map((key) => ({
        userId: req.user!.id,
        key,
      }))
    );

    return res.status(200).json({ success: true, codes: generate });
  }
);

export default router;
