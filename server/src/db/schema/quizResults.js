import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { quizzes } from "./quizzes.js";

export const quizResults = pgTable(
  "quiz_results",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    quizId: uuid("quiz_id")
      .references(() => quizzes.id, {
        onDelete: "cascade",
      })
      .notNull(),

    userId: varchar("user_id", {
      length: 255,
    }).notNull(),

    score: integer("score").notNull(),

    totalQuestions: integer(
      "total_questions"
    ).notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },

  (table) => ({
    quizUserUnique: unique(
      "quiz_user_unique"
    ).on(
      table.quizId,
      table.userId
    ),
  })
);

