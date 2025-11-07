import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { blogTable } from "./blog";

export const blogAttachmentsTable = mysqlTable("blog_attachments", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  relatedBlogId: varchar("related_blog_id", {
    length: 36,
  }).references(() => blogTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
