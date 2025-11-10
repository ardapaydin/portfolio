import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { portfolioTable } from "./portfolio";

export const portfolioLikesTable = mysqlTable("portfolio_likes", {
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  portfolioId: varchar("portfolio_id", { length: 36 })
    .notNull()
    .references(() => portfolioTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
