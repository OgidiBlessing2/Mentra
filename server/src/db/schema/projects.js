import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  title: varchar("title", {
    length: 150,
  }).notNull(),

  description: text("description"),

  githubUrl: text("github_url"),

  liveUrl: text("live_url"),

  status: varchar("status", {
    length: 30,
  })
    .default("planned")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});