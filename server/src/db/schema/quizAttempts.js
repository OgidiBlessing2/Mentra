import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { quizzes } from "./quizzes.js";

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),

  quizId: uuid("quiz_id")
    .references(() => quizzes.id, {
      onDelete: "cascade",
    })
    .notNull(),

  userId: text("user_id").notNull(),

  score: integer("score").notNull(),

  totalQuestions: integer("total_questions").notNull(),

  percentage: integer("percentage").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});