import { sql } from "drizzle-orm";
import {
  boolean,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const portfolioTable = mysqlTable("portfolio", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  subdomain: varchar("subdomain", { length: 255 }).notNull().unique(),
  template: varchar("template", { length: 100 }).notNull(),
  data: json("data")
    .default(sql`'{}'`)
    .notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
