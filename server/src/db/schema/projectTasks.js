import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  date,
} from "drizzle-orm/pg-core";

import { projects } from "./projects.js";

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in-progress",
  "completed",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);

export const projectTasks = pgTable("project_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  description: text("description"),

  status: taskStatusEnum("status")
    .default("todo")
    .notNull(),

  priority: taskPriorityEnum("priority")
    .default("medium")
    .notNull(),

  dueDate: date("due_date"),

  position: integer("position")
    .default(0)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});