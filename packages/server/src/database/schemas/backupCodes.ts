import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const backupCodesTable = mysqlTable("backup_codes", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  key: varchar("key", { length: 36 }).notNull(),
  used: boolean("used").default(false),
  usedAt: timestamp("used_at"),
});
