import {
  pgTable,
  uuid,
  text,
  integer,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { quizzes } from "./quizzes.js";

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    quizId: uuid("quiz_id")
      .references(() => quizzes.id, {
        onDelete: "cascade",
      })
      .notNull(),

    question: text("question").notNull(),

    optionA: text("option_a").notNull(),

    optionB: text("option_b").notNull(),

    optionC: text("option_c").notNull(),

    optionD: text("option_d").notNull(),

    correctAnswer: integer("correct_answer")
      .notNull(),

    explanation: text("explanation"),
  }
);

export const quizQuestionRelations =
  relations(
    quizQuestions,
    ({ one }) => ({
      quiz: one(quizzes, {
        fields: [quizQuestions.quizId],
        references: [quizzes.id],
      }),
    })
  );