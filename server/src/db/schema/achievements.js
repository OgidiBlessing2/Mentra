import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),

  key: varchar("key", {
    length: 50,
  })
    .notNull()
    .unique(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  description: text("description"),

  icon: varchar("icon", {
    length: 20,
  }),

  requirementType: varchar("requirement_type", {
    length: 50,
  }).notNull(),

  requirementValue: integer("requirement_value"),

  createdAt: timestamp("created_at").defaultNow(),
});