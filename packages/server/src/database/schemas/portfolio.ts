import { sql } from "drizzle-orm";
import {
  boolean,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { blogTable } from "./blog";

export const portfolioTable = mysqlTable("portfolios", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 255 }).notNull().unique(),
  template: varchar("template", { length: 100 }).notNull(),
  data: json("data")
    .default(sql`'{}'`)
    .notNull(),
  blogId: varchar("blog_id", { length: 36 }).references(() => blogTable.id, {
    onDelete: "set null",
  }),
  isPublished: boolean("is_published").default(false).notNull(),
  discoverable: boolean("discoverable").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
