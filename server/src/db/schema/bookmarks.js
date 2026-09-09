import {
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  userId: uuid("user_id")
    .notNull(),

  lessonId: uuid("lesson_id")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow(),
});