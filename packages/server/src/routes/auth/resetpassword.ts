import express from "express";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { requestResetKeySchema } from "../../helpers/validations/resetpassword/request";
import { createResetKey, validateKey } from "../../helpers/email/reset";
import { resetPasswordSchema } from "../../helpers/validations/resetpassword/reset";
import { db } from "../../database/db";
import { eq } from "drizzle-orm";
import { resetPasswordTokensTable, usersTable } from "../../database";
import { EncryptPassword } from "../../helpers/encryptions/password";
const router = express.Router();

router.post(
  "/request-key",
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, requestResetKeySchema),
  async (req, res) => {
    const { email } = req.body;
    const k = await createResetKey(email);
    if (!k) return res.status(400).json({ success: false, message: "" });

    return res.status(200).json({
      success: true,
    });
  }
);

router.post(
  "/reset-password",
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, resetPasswordSchema),
  async (req, res) => {
    const { key, password } = req.body;
    const [find] = await db
      .select()
      .from(resetPasswordTokensTable)
      .where(eq(resetPasswordTokensTable.token, key));

    await db
      .update(usersTable)
      .set({
        password: EncryptPassword(password),
      })
      .where(eq(usersTable.id, find.userId!));

    await db
      .update(resetPasswordTokensTable)
      .set({
        used: true,
      })
      .where(eq(resetPasswordTokensTable.token, key));

    return res.status(200).json({ success: true });
  }
);

router.get("/reset-password", async (req, res) => {
  const { token } = req.query;
  if (!token)
    return res.status(400).json({
      success: false,
      message: "token is required",
      errors: { token: ["Token is required"] },
    });
  return res.status(200).json({
    success: true,
    valid: await validateKey(token as string),
  });
});

export default router;
