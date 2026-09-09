import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { lessons } from "./lesson.js";

export const lessonContents = pgTable(
  "lesson_contents",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    lessonId: uuid("lesson_id")
      .references(() => lessons.id, {
        onDelete: "cascade",
      })
      .notNull(),

    notes: text("notes"),

    codeExample: text("code_example"),

    exercise: text("exercise"),

    summary: text("summary"),

    createdAt: timestamp("created_at")
      .defaultNow(),
  }
);