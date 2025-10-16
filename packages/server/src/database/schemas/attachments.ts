import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { portfolioTable } from "./portfolio";

export const attachmentsTable = mysqlTable("attachments", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  relatedPortfolioId: varchar("related_portfolio_id", {
    length: 36,
  }).references(() => portfolioTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
