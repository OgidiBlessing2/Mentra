import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { modules } from "./modules.js";

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),

  moduleId: uuid("module_id")
    .references(() => modules.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: varchar("title", { length: 150 }).notNull(),

  description: varchar("description", {
    length: 500,
  }),

  estimatedMinutes: integer("estimated_minutes"),

  project: varchar("project", {
    length: 255,
  }),

  order: integer("order").notNull(),

  status: varchar("status", {
    length: 20,
  }).default("locked"),

  createdAt: timestamp("created_at").defaultNow(),
});