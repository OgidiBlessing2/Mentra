import { pgTable, uuid, varchar, text, timestamp, unique, integer, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const roadmaps = pgTable("roadmaps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	title: varchar({ length: 150 }).notNull(),
	career: varchar({ length: 100 }).notNull(),
	level: varchar({ length: 50 }).notNull(),
	goal: text(),
	status: varchar({ length: 20 }).default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	currentModule: uuid("current_module"),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 255 }).notNull(),
	avatar: text(),
	xp: integer().default(0),
	level: integer().default(1),
	streak: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	username: varchar({ length: 30 }),
	bio: text(),
	clerkId: varchar("clerk_id", { length: 255 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
	unique("users_clerk_id_unique").on(table.clerkId),
]);

export const lessonContents = pgTable("lesson_contents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonId: uuid("lesson_id").notNull(),
	notes: text(),
	codeExample: text("code_example"),
	exercise: text(),
	summary: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lessons.id],
			name: "lesson_contents_lesson_id_lessons_id_fk"
		}).onDelete("cascade"),
]);

export const modules = pgTable("modules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roadmapId: uuid("roadmap_id").notNull(),
	title: varchar({ length: 150 }).notNull(),
	order: integer().notNull(),
	description: varchar({ length: 500 }),
	estimatedDays: integer("estimated_days").default(1),
	status: varchar({ length: 20 }).default('locked'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.roadmapId],
			foreignColumns: [roadmaps.id],
			name: "modules_roadmap_id_roadmaps_id_fk"
		}).onDelete("cascade"),
]);

export const lessons = pgTable("lessons", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	moduleId: uuid("module_id").notNull(),
	title: varchar({ length: 150 }).notNull(),
	description: varchar({ length: 500 }),
	estimatedMinutes: integer("estimated_minutes"),
	project: varchar({ length: 255 }),
	order: integer().notNull(),
	status: varchar({ length: 20 }).default('locked'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.moduleId],
			foreignColumns: [modules.id],
			name: "lessons_module_id_modules_id_fk"
		}).onDelete("cascade"),
]);

export const notes = pgTable("notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	lessonId: uuid("lesson_id"),
	title: varchar({ length: 200 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const quizzes = pgTable("quizzes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonId: uuid("lesson_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lessons.id],
			name: "quizzes_lesson_id_lessons_id_fk"
		}).onDelete("cascade"),
]);

export const quizQuestions = pgTable("quiz_questions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	quizId: uuid("quiz_id").notNull(),
	question: text().notNull(),
	optionA: text("option_a").notNull(),
	optionB: text("option_b").notNull(),
	optionC: text("option_c").notNull(),
	optionD: text("option_d").notNull(),
	correctAnswer: integer("correct_answer").notNull(),
	explanation: text(),
}, (table) => [
	foreignKey({
			columns: [table.quizId],
			foreignColumns: [quizzes.id],
			name: "quiz_questions_quiz_id_quizzes_id_fk"
		}).onDelete("cascade"),
]);

export const quizResults = pgTable("quiz_results", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	quizId: uuid("quiz_id").notNull(),
	userId: uuid("user_id").notNull(),
	score: integer().notNull(),
	totalQuestions: integer("total_questions").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.quizId],
			foreignColumns: [quizzes.id],
			name: "quiz_results_quiz_id_quizzes_id_fk"
		}).onDelete("cascade"),
]);
