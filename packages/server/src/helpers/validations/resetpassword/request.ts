import z from "zod";
import { db } from "../../../database/db";
import { usersTable } from "../../../database";
import { eq } from "drizzle-orm";

export const requestResetKeySchema = z.object({
  email: z
    .email("Email must be a valid email address")
    .refine(async (arg: string) => {
      const [find] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, arg));
      return !!find;
    }, "User with this email is not found"),
});
