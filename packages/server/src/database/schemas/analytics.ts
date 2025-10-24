import {
  datetime,
  int,
  mysqlTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { portfolioTable } from "./portfolio";

export const analyticsTable = mysqlTable(
  "analytics",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .notNull()
      .$default(() => crypto.randomUUID()),
    portfolioId: varchar("related_portfolio_id", {
      length: 36,
    }).references(() => portfolioTable.id, { onDelete: "cascade" }),
    date: datetime("date").notNull(),
    views: int("views").default(0).notNull(),
    uniqueVisitors: int("unique_visitors").default(0).notNull(),
  },
  (table) => ({
    uniquePerDay: unique("unique_per_day").on(table.portfolioId, table.date),
  })
);

export const analyticsIpsTable = mysqlTable("analytics_ips", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  portfolioId: varchar("portfolio_id", { length: 255 }).references(
    () => portfolioTable.id,
    { onDelete: "cascade" }
  ),
  country: varchar("country", { length: 32 }).notNull(),
  ip: varchar("ip", { length: 64 }).notNull(),
  date: datetime("date").notNull(),
});
