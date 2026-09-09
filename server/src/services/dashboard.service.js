import {
  eq,
  and,
  count,
  inArray,
  gte,
  lt,
  desc,
} from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { roadmaps } from "../db/schema/roadmaps.js";
import { modules } from "../db/schema/modules.js";
import { lessons } from "../db/schema/lesson.js";
import { quizAttempts } from "../db/schema/quizAttempts.js";

export async function getDashboardService(userId) {
  // -----------------------------------------
  // Find user's roadmap
  // -----------------------------------------

  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.userId, userId))
    .limit(1);

  // -----------------------------------------
  // Get user stats
  // -----------------------------------------

  const [user] = await db
    .select({
      streak: users.streak,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // -----------------------------------------
  // No roadmap
  // -----------------------------------------

  if (!roadmap) {
    return {
      currentRoadmap: null,
      currentLesson: null,

      stats: {
        completedLessons: 0,
        totalLessons: 0,
        completedQuizzes: 0,
        streak: 0,
        progress: 0,
      },

      today: {
        completedLessons: 0,
        goal: 2,
        progress: 0,
      },

      recentActivity: [],
    };
  }

  // -----------------------------------------
  // Find current module
  // -----------------------------------------

  const [currentModule] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, roadmap.currentModule));

  // -----------------------------------------
  // Get all modules in this roadmap
  // -----------------------------------------

  const roadmapModules = await db
    .select()
    .from(modules)
    .where(eq(modules.roadmapId, roadmap.id));

  const moduleIds = roadmapModules.map(
    (module) => module.id
  );

  // -----------------------------------------
  // Get all lessons in this roadmap
  // -----------------------------------------

  let roadmapLessons = [];

  if (moduleIds.length > 0) {
    roadmapLessons = await db
      .select()
      .from(lessons)
      .where(
        inArray(
          lessons.moduleId,
          moduleIds
        )
      );
  }

  // -----------------------------------------
  // Sort lessons
  // -----------------------------------------

  roadmapLessons.sort((a, b) => {
    const moduleA = roadmapModules.find(
      (module) => module.id === a.moduleId
    );

    const moduleB = roadmapModules.find(
      (module) => module.id === b.moduleId
    );

    if (
      (moduleA?.order ?? 0) !==
      (moduleB?.order ?? 0)
    ) {
      return (
        (moduleA?.order ?? 0) -
        (moduleB?.order ?? 0)
      );
    }

    return a.order - b.order;
  });

  // -----------------------------------------
  // Total completed lessons
  // -----------------------------------------

  const [{ completedLessons }] = await db
    .select({
      completedLessons: count(),
    })
    .from(lessons)
    .innerJoin(
      modules,
      eq(lessons.moduleId, modules.id)
    )
    .where(
      and(
        eq(modules.roadmapId, roadmap.id),
        eq(lessons.status, "completed")
      )
    );

  // -----------------------------------------
  // Total lessons
  // -----------------------------------------

  const [{ totalLessons }] = await db
    .select({
      totalLessons: count(),
    })
    .from(lessons)
    .innerJoin(
      modules,
      eq(lessons.moduleId, modules.id)
    )
    .where(
      eq(modules.roadmapId, roadmap.id)
    );

  // -----------------------------------------
  // Overall roadmap progress
  // -----------------------------------------

  const progress =
    totalLessons > 0
      ? Math.round(
          (Number(completedLessons) /
            Number(totalLessons)) *
            100
        )
      : 0;

  // -----------------------------------------
  // Completed quizzes
  // -----------------------------------------

  const [{ completedQuizzes }] = await db
    .select({
      completedQuizzes: count(),
    })
    .from(quizAttempts)
    .where(
      eq(
        quizAttempts.userId,
        userId
      )
    );

  // -----------------------------------------
  // Today's learning goal
  // -----------------------------------------

  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(
    startOfDay
  );

  startOfTomorrow.setDate(
    startOfTomorrow.getDate() + 1
  );

  const [
    { completedToday },
  ] = await db
    .select({
      completedToday: count(),
    })
    .from(lessons)
    .innerJoin(
      modules,
      eq(lessons.moduleId, modules.id)
    )
    .where(
      and(
        eq(
          modules.roadmapId,
          roadmap.id
        ),
        eq(
          lessons.status,
          "completed"
        ),
        gte(
          lessons.completedAt,
          startOfDay
        ),
        lt(
          lessons.completedAt,
          startOfTomorrow
        )
      )
    );

  const dailyGoal = 2;

  const todayProgress =
    dailyGoal > 0
      ? Math.min(
          Math.round(
            (Number(completedToday) /
              dailyGoal) *
              100
          ),
          100
        )
      : 0;

  // -----------------------------------------
  // Recent completed lessons
  // -----------------------------------------

  const recentCompletedLessons =
    await db
      .select({
        id: lessons.id,
        title: lessons.title,
        completedAt:
          lessons.completedAt,
        moduleTitle:
          modules.title,
      })
      .from(lessons)
      .innerJoin(
        modules,
        eq(
          lessons.moduleId,
          modules.id
        )
      )
      .where(
        and(
          eq(
            modules.roadmapId,
            roadmap.id
          ),
          eq(
            lessons.status,
            "completed"
          )
        )
      )
      .orderBy(
        desc(lessons.completedAt)
      )
      .limit(5);

  // -----------------------------------------
  // Build recent activity
  // -----------------------------------------

  const recentActivity =
    recentCompletedLessons.map(
      (lesson) => ({
        id: `lesson-${lesson.id}`,
        text: `Completed ${lesson.title}`,
        type: "lesson",
        time: lesson.completedAt,
      })
    );

  // Add roadmap creation activity
  if (roadmap.createdAt) {
    recentActivity.push({
      id: `roadmap-${roadmap.id}`,
      text: "Generated AI Roadmap",
      type: "ai",
      time: roadmap.createdAt,
    });
  }

  // -----------------------------------------
  // Sort all activity by newest
  // -----------------------------------------

  recentActivity.sort(
    (a, b) =>
      new Date(b.time) -
      new Date(a.time)
  );

  const latestActivity =
    recentActivity.slice(0, 5);

  // -----------------------------------------
  // Find current lesson
  // -----------------------------------------

  let currentLesson = null;

  if (currentModule) {
    currentLesson =
      roadmapLessons.find(
        (lesson) =>
          lesson.moduleId ===
            currentModule.id &&
          lesson.status === "active"
      ) ?? null;
  }

  // -----------------------------------------
  // Current lesson information
  // -----------------------------------------

  if (currentLesson) {
    const lessonIndex =
      roadmapLessons.findIndex(
        (lesson) =>
          lesson.id ===
          currentLesson.id
      );

    const lessonNumber =
      lessonIndex >= 0
        ? lessonIndex + 1
        : 1;

    currentLesson = {
      ...currentLesson,

      module:
        currentModule?.title ??
        null,

      lessonNumber,

      totalLessons,

      duration:
        currentLesson.estimatedMinutes ??
        0,

      progress:
        totalLessons > 0
          ? Math.round(
              (Number(
                completedLessons
              ) /
                Number(
                  totalLessons
                )) *
                100
            )
          : 0,
    };
  }

  // -----------------------------------------
  // Return dashboard
  // -----------------------------------------

  return {
    currentRoadmap: roadmap,

    currentLesson,

    stats: {
      completedLessons,
      totalLessons,
      completedQuizzes,
      streak: user?.streak ?? 0,
      progress,
    },

    today: {
      completedLessons:
        Number(completedToday),

      goal: dailyGoal,

      progress: todayProgress,
    },

    recentActivity:
      latestActivity,
  };
}
