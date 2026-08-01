import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { users } from "./users.js";


import { modules } from "./modules.js";
export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id"),

  title: varchar("title", { length: 150 }).notNull(),

  career: varchar("career", { length: 100 }).notNull(),

  level: varchar("level", { length: 50 }).notNull(),

  goal: text("goal"),

  status: varchar("status", { length: 20 })
  .default("active")
  .notNull(),

  currentModule: uuid("current_module"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const roadmapsRelations = relations(roadmaps, ({ one }) => ({
  user: one(users, {
    fields: [roadmaps.userId],
    references: [users.id],
  }),
}));


export const roadmapRelations = relations(
  roadmaps,
  ({ many }) => ({
    modules: many(modules),
  })
);