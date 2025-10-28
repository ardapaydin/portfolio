import { and, eq } from "drizzle-orm";
import { backupCodesTable, twoFactorAuthenticationTable } from "../../database";
import { db } from "../../database/db";
import speakeasy from "speakeasy";
export async function validateTwoFA(
  userId: string,
  twoFactorType: string,
  twoFactorCode: string,
  options: ("app" | "backup")[] = ["app", "backup"]
) {
  const [findTwoFactor] = await db
    .select()
    .from(twoFactorAuthenticationTable)
    .where(
      and(
        eq(twoFactorAuthenticationTable.userId, userId),
        eq(twoFactorAuthenticationTable.verified, true)
      )
    );

  if (findTwoFactor) {
    if (!["backup", "app"].includes(twoFactorType) || !twoFactorCode)
      return { success: false, message: "2FA" };
    if (twoFactorType == "backup") {
      if (!options.includes("backup"))
        return {
          success: false,
          errors: { code: ["Backup codes is not supported"] },
        };
      const [findCode] = await db
        .select()
        .from(backupCodesTable)
        .where(
          and(
            eq(backupCodesTable.userId, userId),
            eq(backupCodesTable.key, twoFactorCode),
            eq(backupCodesTable.used, false)
          )
        );

      if (!findCode)
        return {
          success: false,
          errors: { code: ["Backup code is invalid or already used"] },
        };

      await db
        .update(backupCodesTable)
        .set({ used: true })
        .where(eq(backupCodesTable.id, findCode.id));
    } else if (twoFactorType == "app") {
      const verify = speakeasy.totp.verify({
        secret: findTwoFactor.secret,
        encoding: "base32",
        token: twoFactorCode,
        window: 1,
      });

      if (!verify)
        return {
          success: false,
          errors: {
            code: ["Invalid code provided."],
          },
        };
    }
  }

  return { success: true };
}
