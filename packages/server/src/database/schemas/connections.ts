import { json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { sql } from "drizzle-orm";

export const connectionsTable = mysqlTable("connections", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  service: varchar("service", { length: 255 }).notNull(),
  accessToken: varchar("access_token", { length: 255 }),
  userId: varchar("user_id", { length: 36 }).references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  serviceUser: json("service_user")
    .notNull()
    .default(sql`{}`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
