import { and, eq } from "drizzle-orm";
import { resetPasswordTokensTable, usersTable } from "../../../database";
import { db } from "../../../database/db";
import crypto from "crypto";
import { sendEmail } from "../send";
export async function createResetKey(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) return null;

  const [find] = await db
    .select()
    .from(resetPasswordTokensTable)
    .where(eq(resetPasswordTokensTable.email, email));
  if (find) {
    const createdAt = new Date(find.createdAt!);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes < 30) {
      sendEmail("resetPassword", user.email, {
        SUBJECT: "Reset Password",
        RESET_LINK: `${process.env.DESIGN_APP_URL}/auth/reset-password?token=${find.token}&uid=${user.id}`,
      });
      return find.token;
    }

    await db
      .delete(resetPasswordTokensTable)
      .where(eq(resetPasswordTokensTable.token, find.token));
  }
  const raw = crypto.randomBytes(32);
  const token = raw.toString("base64url");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  await db.insert(resetPasswordTokensTable).values({
    userId: user.id,
    token: hash,
    email,
  });

  sendEmail("resetPassword", user.email, {
    SUBJECT: "Reset Password",
    RESET_LINK: `${process.env.DESIGN_APP_URL}/auth/reset-password?token=${hash}&uid=${user.id}`,
  });

  return hash;
}

export async function validateKey(key: string) {
  const [find] = await db
    .select()
    .from(resetPasswordTokensTable)
    .where(
      and(
        eq(resetPasswordTokensTable.token, key),
        eq(resetPasswordTokensTable.used, false)
      )
    );
  if (!find) return false;
  const createdAt = new Date(find.createdAt!);
  const now = new Date();
  const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, find.email));

  if (user.id != find.userId && diffMinutes > 30) {
    await db
      .delete(resetPasswordTokensTable)
      .where(eq(resetPasswordTokensTable.token, key));
    return false;
  }

  return true;
}
