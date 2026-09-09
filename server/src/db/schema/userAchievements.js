import {
  pgTable,
  uuid,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { achievements } from "./achievements.js";

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    achievementId: uuid("achievement_id")
      .notNull()
      .references(() => achievements.id, {
        onDelete: "cascade",
      }),

    unlockedAt: timestamp("unlocked_at").defaultNow(),
  },
  (table) => ({
    userAchievementUnique: unique(
      "user_achievement_unique"
    ).on(
      table.userId,
      table.achievementId
    ),
  })
);




