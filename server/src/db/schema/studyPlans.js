import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { roadmaps } from "./roadmaps.js";

export const studyPlanStatusEnum = pgEnum("study_plan_status", [
  "active",
  "completed",
  "paused",
]);

export const studyPlans = pgTable("study_plans", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  roadmapId: uuid("roadmap_id")
    .references(() => roadmaps.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: varchar("title", {
    length: 150,
  }).notNull(),

  goal: text("goal"),

  startDate: date("start_date").notNull(),

  endDate: date("end_date").notNull(),

  dailyMinutes: integer("daily_minutes").default(60).notNull(),

  status: studyPlanStatusEnum("status")
    .default("active")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});