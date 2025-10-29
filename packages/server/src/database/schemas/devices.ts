import {
  mysqlTable,
  text,
  varchar,
  binary,
  int,
  json,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const devicesTable = mysqlTable("devices", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  credId: varchar("credential_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 50 }),
  publicKey: binary("public_key", { length: 255 }).notNull(),
  counter: int("counter").notNull(),
  transports: json("transports").notNull(),
});
