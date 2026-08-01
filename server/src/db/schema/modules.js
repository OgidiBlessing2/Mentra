import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { roadmaps } from "./roadmaps.js";
import { relations } from "drizzle-orm";

export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),

  roadmapId: uuid("roadmap_id")
    .references(() => roadmaps.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: varchar("title", { length: 150 }).notNull(),

  description: varchar("description", {
    length: 500,
  }),

  order: integer("order").notNull(),

  estimatedDays: integer("estimated_days").default(1),

  status: varchar("status", {
    length: 20,
  }).default("locked"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const moduleRelations = relations(
  modules,
  ({ one }) => ({
    roadmap: one(roadmaps, {
      fields: [modules.roadmapId],
      references: [roadmaps.id],
    }),
  })
);