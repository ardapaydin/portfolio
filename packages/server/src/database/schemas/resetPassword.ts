import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const resetPasswordTokensTable = mysqlTable("password_reset_tokens", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 }).references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  token: varchar("token", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  used: boolean("used").default(false),
});
