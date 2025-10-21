import { int, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { portfolioTable } from "./portfolio";

export const averageTimeTable = mysqlTable("average_times", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  relatedPortfolioId: varchar("related_portfolio_id", {
    length: 36,
  }).references(() => portfolioTable.id, { onDelete: "cascade" }),
  ip: varchar("ip", { length: 64 }).notNull(),
  duration: int("duration").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
