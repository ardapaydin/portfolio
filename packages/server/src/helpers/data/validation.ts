import z from "zod";
import { db } from "../../database/db";
import { attachmentsTable } from "../../database";
import { eq } from "drizzle-orm";
import { Module } from "./modules";

export const link = z.object({
  name: z.string().min(2).max(100),
  url: z.url("Invalid URL").refine((val) => /^https?:\/\//.test(val), {
    message: "URL must start with http or https",
  }),
});
export const meta = z
  .object({
    title: z.string().max(100).optional(),
    favicon: z.uuid().nullable().refine(findImage).optional(),
  })
  .optional();

export const hexRegex = /^#([0-9A-Fa-f]{6})$/;

export const modules = z
  .array(z.union(Object.values(Module).map((x) => z.literal(x))))
  .refine((arr) => new Set(arr).size == arr.length, {
    message: "duplicate modules are not allowed",
  });

export async function findImage(
  arg: string | undefined | null
): Promise<boolean> {
  if (!arg) return true;
  const [findId] = await db
    .select()
    .from(attachmentsTable)
    .where(eq(attachmentsTable.id, arg));
  return !!findId;
}
