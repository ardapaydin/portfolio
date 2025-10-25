import {
  json,
  mysqlTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { portfolioTable } from "./portfolio";

export const moduleConfigsTable = mysqlTable("module_configs", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  moduleId: varchar("moduleId", { length: 32 }).notNull(),
  config: json("config"),
  portfolioId: varchar("portfolio_id", { length: 36 })
    .notNull()
    .references(() => portfolioTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
