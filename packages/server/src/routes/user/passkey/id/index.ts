import express from "express";
import BodyValidationMiddleware from "../../../../helpers/middlewares/validation";
import { editPasskeySchema } from "../../../../helpers/validations/user/passkey/edit";
import { and, count, eq } from "drizzle-orm";
import { db } from "../../../../database/db";
import { devicesTable } from "../../../../database";
import { requireAuth } from "../../../../helpers/middlewares/auth";
import { validateMFA } from "../../../../helpers/utils/validateMFA";
const router = express.Router();

router.put(
  "/:id",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, editPasskeySchema),
  async (req, res) => {
    const { id } = req.params;
    const [findId] = await db
      .select()
      .from(devicesTable)
      .where(
        and(eq(devicesTable.id, id), eq(devicesTable.userId, req.user!.id))
      );
    if (!findId)
      return res
        .status(404)
        .json({ success: false, message: "Device not found" });
    const { name } = req.body;
    const [findName] = await db
      .select({ count: count() })
      .from(devicesTable)
      .where(
        and(eq(devicesTable.name, name), eq(devicesTable.userId, req.user!.id))
      );
    if (findName.count)
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        errors: {
          name: ["Security key with this name is already exists"],
        },
      });

    await db
      .update(devicesTable)
      .set({
        name,
      })
      .where(eq(devicesTable.id, id));

    return res.status(200).json({ success: true });
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const validate = await validateMFA(req as unknown as Express.Request, [
    "webauthn",
  ]);

  if (!validate.success) return res.status(400).json(validate);

  const [del] = await db
    .delete(devicesTable)
    .where(and(eq(devicesTable.id, id), eq(devicesTable.userId, req.user!.id)));
  if (!del.affectedRows)
    return res
      .status(404)
      .json({ success: false, message: "Device not found" });

  return res.status(200).json({ success: true });
});

export default router;
