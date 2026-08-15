import { and, eq, gt, asc, count } from "drizzle-orm";
import { db } from "../db/index.js";
import { getLessonContent } from "./lessonContent.service.js";
import { lessons } from "../db/schema/lesson.js";
import { modules } from "../db/schema/modules.js";
import { roadmaps } from "../db/schema/roadmaps.js";
// import { unlockAchievement } from "./achievement.service.js";
import { checkUserAchievements } from "./achievementChecker.service.js";
import { updateUserStreak } from "./streak.service.js";
/*
|--------------------------------------------------------------------------
| Get Lesson
|--------------------------------------------------------------------------
*/

export async function getLessonService(id) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, id));

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const [module] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, lesson.moduleId));

  const content = await getLessonContent(lesson.id);

  const [lessonCount] = await db
    .select({
      total: count(),
    })
    .from(lessons)
    .where(eq(lessons.moduleId, lesson.moduleId));

  return {
    ...lesson,
    module,
    content,
    progress: {
      current: lesson.order,
      total: Number(lessonCount.total),
    },
  };
}

// current lesson 
export async function getCurrentLessonService(userId) {

   try {
    console.log("req.user:", req.user);

    const lesson = await getCurrentLessonService(req.user.id);

    res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  // Find the user's current roadmap
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.userId, userId))
    .limit(1);

  if (!roadmap) {
    throw new Error("No roadmap found");
  }

  // Find the current module
  const [module] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, roadmap.currentModule));

  if (!module) {
    throw new Error("No active module found");
  }

  // Find the active lesson
 const activeLesson = await db.query.lessons.findFirst({
  where: (l, { and, eq }) =>
    and(
      eq(l.moduleId, module.id),
      eq(l.status, "active")
    ),
});

if (!activeLesson) {
  throw new Error("No active lesson");
}
  return {
    ...activeLesson,
    module,
    roadmap,
  };
}

/*
|--------------------------------------------------------------------------
| Complete Lesson
|--------------------------------------------------------------------------
*/

export async function completeLessonService(id, userId) {
  return await db.transaction(async (tx) => {

    // Current lesson
    const [lesson] = await tx
      .select()
      .from(lessons)
      .where(eq(lessons.id, id));

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Mark completed
    await tx
      .update(lessons)
      .set({
        status: "completed",
      })
      .where(eq(lessons.id, id));



      // -----------------------------------------
// Unlock first lesson achievement 🏆
// -----------------------------------------ss

const updatedUser = await updateUserStreak(userId);

const unlockedAchievements =
  await checkUserAchievements(userId);
    // Find next lesson in same module
    const [nextLesson] = await tx
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, lesson.moduleId),
          gt(lessons.order, lesson.order)
        )
      )
      .orderBy(asc(lessons.order))
      .limit(1);

    // Unlock next lesson
    if (nextLesson) {

      await tx
        .update(lessons)
        .set({
          status: "active",
        })
        .where(eq(lessons.id, nextLesson.id));

      return {
        message: "Lesson completed",
        nextLesson,
      };
    }

    // Current module
    const [currentModule] = await tx
      .select()
      .from(modules)
      .where(eq(modules.id, lesson.moduleId));

    // Find next module
    const [nextModule] = await tx
      .select()
      .from(modules)
      .where(
        and(
          eq(modules.roadmapId, currentModule.roadmapId),
          gt(modules.order, currentModule.order)
        )
      )
      .orderBy(asc(modules.order))
      .limit(1);

    // Unlock next module
  if (nextModule) {
  await tx
    .update(modules)
    .set({
      status: "active",
    })
    .where(eq(modules.id, nextModule.id));

  const [firstLesson] = await tx
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, nextModule.id))
    .orderBy(asc(lessons.order))
    .limit(1);

  if (firstLesson) {
    await tx
      .update(lessons)
      .set({
        status: "active",
      })
      .where(eq(lessons.id, firstLesson.id));
  }




  await tx
    .update(roadmaps)
    .set({
      currentModule: nextModule.id,
    })
    .where(eq(roadmaps.id, currentModule.roadmapId));

 return {
  message: "Module completed",
  nextModule,
  nextLesson: firstLesson,
  unlockedAchievements,
};
}

    return {
  message: "Roadmap completed 🎉",
  unlockedAchievements,
};
  });
}


