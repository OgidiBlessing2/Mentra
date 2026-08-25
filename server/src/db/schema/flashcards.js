import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull(),

  lessonId: uuid("lesson_id"),

  question: text("question").notNull(),

  answer: text("answer").notNull(),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});