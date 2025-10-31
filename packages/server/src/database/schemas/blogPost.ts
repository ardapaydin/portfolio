import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { blogTable } from "./blog";

export const blogPostTable = mysqlTable("blog_post", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  blogId: varchar("blog_id", { length: 36 })
    .notNull()
    .references(() => blogTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 5028 }).notNull(),
  isDraft: boolean("is_draft").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
