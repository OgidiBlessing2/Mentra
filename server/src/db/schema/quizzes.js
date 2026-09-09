import {
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { lessons } from "./lesson.js";
import { quizQuestions } from "./quizQuestions.js";

export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),

  lessonId: uuid("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const quizRelations = relations(
  quizzes,
  ({ one, many }) => ({
    lesson: one(lessons, {
      fields: [quizzes.lessonId],
      references: [lessons.id],
    }),

    questions: many(quizQuestions),
  })
);