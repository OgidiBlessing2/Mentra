import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  clerkId: varchar("clerk_id", { length: 255 })
    .notNull()
    .unique(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  name: varchar("name", { length: 100 }),

  username: varchar("username", { length: 30 }).unique(),

  avatar: text("avatar"),

  bio: text("bio"),

  xp: integer("xp").default(0),

  level: integer("level").default(1),

  streak: integer("streak").default(0),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});