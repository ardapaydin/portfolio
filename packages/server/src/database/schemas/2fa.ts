import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const twoFactorAuthenticationTable = mysqlTable(
  "two_factor_authentication",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .notNull()
      .$default(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 36 })
      .references(() => usersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    secret: varchar("secret", { length: 255 }).notNull(),
    verified: boolean("verified").default(false).notNull(),
    lastUsed: timestamp("last_used").defaultNow(),
  }
);
