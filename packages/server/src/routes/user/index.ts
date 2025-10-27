import express from "express";
import { requireAuth } from "../../helpers/middlewares/auth";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { updateUserSchema } from "../../helpers/validations/user/update";
import { db } from "../../database/db";
import {
  emailVerificationTable,
  portfolioTable,
  usersTable,
} from "../../database";
import { eq } from "drizzle-orm";
import { createToken } from "../../helpers/email/verification";
import {
  ComparePassword,
  EncryptPassword,
} from "../../helpers/encryptions/password";
import deleteDomain from "../../helpers/cloudflare/pages/deleteDomain";
import { deleteUserSchema } from "../../helpers/validations/user/delete";
const router = express.Router();

router.put(
  "/",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, updateUserSchema),
  async (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id));

    if (user.email != email) {
      const [findemail] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
      if (findemail)
        return res.status(400).json({
          success: false,
          message: "email already exists",
          errors: { email: ["This email is already registered"] },
        });

      await db
        .delete(emailVerificationTable)
        .where(eq(emailVerificationTable.userId, req.user!.id));

      await db
        .update(usersTable)
        .set({ emailVerified: false, email })
        .where(eq(usersTable.id, req.user!.id));
      await createToken(email);

      const findPublishedPortfolios = await db
        .select()
        .from(portfolioTable)
        .where(eq(usersTable.id, req.user!.id));
      await db
        .update(portfolioTable)
        .set({ isPublished: false })
        .where(eq(portfolioTable.userId, req.user!.id));
      for (const portfolio of findPublishedPortfolios)
        deleteDomain(portfolio.subdomain + "." + process.env.DOMAIN);
    }

    if (currentPassword && newPassword) {
      const isvalid = ComparePassword(currentPassword, user.password);
      if (!isvalid)
        return res.status(400).json({
          success: false,
          message: "invalid password",
          errors: { currentPassword: ["Password is incorrect"] },
        });

      await db
        .update(usersTable)
        .set({
          password: EncryptPassword(newPassword),
        })
        .where(eq(usersTable.id, req.user!.id));
    }

    await db
      .update(usersTable)
      .set({
        name,
      })
      .where(eq(usersTable.id, req.user!.id));

    return res.status(200).json({ success: true });
  }
);

router.delete(
  "/",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, deleteUserSchema),
  async (req, res) => {
    const { password } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.id));
    const isvalid = ComparePassword(password, user.password);
    if (!isvalid)
      return res.status(400).json({
        success: false,
        message: "invalid password",
        errors: { password: ["Password is incorrect"] },
      });

    await db.delete(usersTable).where(eq(usersTable.id, req.user!.id));

    return res.status(200).json({ success: true });
  }
);

import twoFactorAuthentication from "./2fa";
router.use("/2fa", twoFactorAuthentication);

export default router;
