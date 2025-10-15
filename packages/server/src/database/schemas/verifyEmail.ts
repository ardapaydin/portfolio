import { sql } from "drizzle-orm";
import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const emailVerificationTable = mysqlTable("email_verifications", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 36 })
    .references(() => usersTable.id)
    .notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  used: boolean("used").default(false).notNull(),
});
