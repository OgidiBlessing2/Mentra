import { relations } from "drizzle-orm/relations";
import { lessons, lessonContents, roadmaps, modules, quizzes, quizQuestions, quizResults } from "./schema";

export const lessonContentsRelations = relations(lessonContents, ({one}) => ({
	lesson: one(lessons, {
		fields: [lessonContents.lessonId],
		references: [lessons.id]
	}),
}));

export const lessonsRelations = relations(lessons, ({one, many}) => ({
	lessonContents: many(lessonContents),
	module: one(modules, {
		fields: [lessons.moduleId],
		references: [modules.id]
	}),
	quizzes: many(quizzes),
}));

export const modulesRelations = relations(modules, ({one, many}) => ({
	roadmap: one(roadmaps, {
		fields: [modules.roadmapId],
		references: [roadmaps.id]
	}),
	lessons: many(lessons),
}));

export const roadmapsRelations = relations(roadmaps, ({many}) => ({
	modules: many(modules),
}));

export const quizzesRelations = relations(quizzes, ({one, many}) => ({
	lesson: one(lessons, {
		fields: [quizzes.lessonId],
		references: [lessons.id]
	}),
	quizQuestions: many(quizQuestions),
	quizResults: many(quizResults),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({one}) => ({
	quiz: one(quizzes, {
		fields: [quizQuestions.quizId],
		references: [quizzes.id]
	}),
}));

export const quizResultsRelations = relations(quizResults, ({one}) => ({
	quiz: one(quizzes, {
		fields: [quizResults.quizId],
		references: [quizzes.id]
	}),
}));