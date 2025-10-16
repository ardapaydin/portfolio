import { sql } from "drizzle-orm";
import {
  boolean,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { portfolioTable } from "./portfolio";

export const draftsTable = mysqlTable("drafts", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  portfolioId: varchar("portfolio_id", { length: 36 })
    .notNull()
    .references(() => portfolioTable.id, { onDelete: "cascade" }),
  data: json("data")
    .default(sql`'{}'`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
