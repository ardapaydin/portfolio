import { json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { portfolioTable } from "./portfolio";
import { sql } from "drizzle-orm";

export const eventsTable = mysqlTable("events", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  portfolioId: varchar("portfolio_id", { length: 36 })
    .notNull()
    .references(() => portfolioTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 36 }),
  data: json("data")
    .default(sql`'{}'`)
    .notNull(),
  ip: varchar("ip", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
});
