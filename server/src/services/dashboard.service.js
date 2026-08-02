import { eq, and, count } from "drizzle-orm";
import { db } from "../db/index.js";

import { roadmaps } from "../db/schema/roadmaps.js";
import { modules } from "../db/schema/modules.js";
import { lessons } from "../db/schema/lesson.js";

export async function getDashboardService(userId) {
  // TODO: Replace limit(1) with a userId filter after authentication
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .limit(1);

  if (!roadmap) {
    return {
      currentRoadmap: null,
      currentLesson: null,
      stats: {
        completedLessons: 0,
        completedQuizzes: 0,
        streak: 0,
        progress: 0,
      },
    };
  }

  // Current module
  const [currentModule] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, roadmap.currentModule));

  // Current active lesson
  let currentLesson = null;

  if (currentModule) {
    [currentLesson] = await db
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, currentModule.id),
          eq(lessons.status, "active")
        )
      );
  }

  // Completed lessons
  const [{ completedLessons }] = await db
    .select({
      completedLessons: count(),
    })
    .from(lessons)
    .where(eq(lessons.status, "completed"));

  // Total lessons
  const [{ totalLessons }] = await db
    .select({
      totalLessons: count(),
    })
    .from(lessons);

  // Progress percentage
  const progress =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  return {
    currentRoadmap: roadmap,

    currentLesson: currentLesson
      ? {
          ...currentLesson,
          module: currentModule.title,
        }
      : null,

    stats: {
      completedLessons,
      completedQuizzes: 0, // until quiz tracking is implemented
      streak: 0,            // until streak tracking is implemented
      progress,
    },
  };
}