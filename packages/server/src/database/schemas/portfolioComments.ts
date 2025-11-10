import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { portfolioTable } from "./portfolio";

export const portfolioCommentsTable = mysqlTable("portfolio_comments", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  portfolioId: varchar("portfolio_id", { length: 36 })
    .notNull()
    .references(() => portfolioTable.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 2048 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
