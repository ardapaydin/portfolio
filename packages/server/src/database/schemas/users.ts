import { sql } from "drizzle-orm";
import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  profilePicture: varchar("profile_picture", { length: 255 }),
  name: varchar("name", { length: 255 }),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
