import {
  boolean,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { blogTable } from "./blog";
import { sql } from "drizzle-orm";

export const blogPostTable = mysqlTable("blog_post", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  blogId: varchar("blog_id", { length: 36 })
    .notNull()
    .references(() => blogTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 4028 }).notNull(),
  image: varchar("image", { length: 256 }),
  tags: json("tags")
    .notNull()
    .default(sql`'[]'`),
  isDraft: boolean("is_draft").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
