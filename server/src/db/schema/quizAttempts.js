import {
  pgTable,
  uuid,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { quizzes } from "./quizzes.js";
import { users } from "./users.js";

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),

  quizId: uuid("quiz_id")
    .references(() => quizzes.id, {
      onDelete: "cascade",
    })
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  score: integer("score").notNull(),

  totalQuestions: integer("total_questions").notNull(),

  percentage: integer("percentage").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});