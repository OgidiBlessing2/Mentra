
import { and, eq, gt, asc, count } from "drizzle-orm";
import { db } from "../db/index.js";
import { getLessonContent } from "./lessonContent.service.js";
import { lessons } from "../db/schema/lesson.js";
import { modules } from "../db/schema/modules.js";
import { roadmaps } from "../db/schema/roadmaps.js";
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

/*
|--------------------------------------------------------------------------
| Get Current Lesson
|--------------------------------------------------------------------------
*/

export async function getCurrentLessonService(userId) {
  console.log("========================================");
  console.log("📚 GET CURRENT LESSON");
  console.log("👤 User ID:", userId);
  console.log("========================================");

  if (!userId) {
    throw new Error("User ID is missing");
  }

  // -----------------------------------------
  // Find user's roadmap
  // -----------------------------------------

  console.log("🗺️ Looking for roadmap...");

  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.userId, userId))
    .limit(1);

  console.log("🗺️ Roadmap:", roadmap);

  if (!roadmap) {
    throw new Error(
      "No roadmap found for this user"
    );
  }

  // -----------------------------------------
  // Check current module
  // -----------------------------------------

  console.log(
    "📦 Current module ID:",
    roadmap.currentModule
  );

  if (!roadmap.currentModule) {
    throw new Error(
      "Roadmap does not have a current module"
    );
  }

  // -----------------------------------------
  // Find current module
  // -----------------------------------------

  console.log("📦 Looking for current module...");

  const [module] = await db
    .select()
    .from(modules)
    .where(
      eq(modules.id, roadmap.currentModule)
    )
    .limit(1);

  console.log("📦 Current module:", module);

  if (!module) {
    throw new Error(
      "Current module not found"
    );
  }

  // -----------------------------------------
  // Find active lesson
  // -----------------------------------------

  console.log(
    "📖 Looking for active lesson..."
  );

  const [activeLesson] = await db
    .select()
    .from(lessons)
    .where(
      and(
        eq(lessons.moduleId, module.id),
        eq(lessons.status, "active")
      )
    )
    .orderBy(asc(lessons.order))
    .limit(1);

  console.log(
    "📖 Active lesson:",
    activeLesson
  );

  if (!activeLesson) {
    throw new Error(
      "No active lesson found in the current module"
    );
  }

  // -----------------------------------------
  // Return current learning context
  // -----------------------------------------

  console.log(
    "✅ Current lesson found:",
    activeLesson.title
  );

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

export async function completeLessonService(
  id,
  userId
) {
  const result = await db.transaction(
    async (tx) => {

      // -----------------------------------------
      // Find current lesson
      // -----------------------------------------

      const [lesson] = await tx
        .select()
        .from(lessons)
        .where(eq(lessons.id, id));

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      // -----------------------------------------
      // Mark lesson completed
      // -----------------------------------------

      await tx
        .update(lessons)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(lessons.id, id));

      // -----------------------------------------
      // Find next lesson
      // -----------------------------------------

      const [nextLesson] = await tx
        .select()
        .from(lessons)
        .where(
          and(
            eq(
              lessons.moduleId,
              lesson.moduleId
            ),
            gt(
              lessons.order,
              lesson.order
            )
          )
        )
        .orderBy(asc(lessons.order))
        .limit(1);

      // -----------------------------------------
      // Next lesson exists
      // -----------------------------------------

      if (nextLesson) {
        await tx
          .update(lessons)
          .set({
            status: "active",
          })
          .where(
            eq(
              lessons.id,
              nextLesson.id
            )
          );

        return {
          message: "Lesson completed",
          nextLesson,
          moduleCompleted: false,
        };
      }

      // -----------------------------------------
      // Find current module
      // -----------------------------------------

      const [currentModule] = await tx
        .select()
        .from(modules)
        .where(
          eq(
            modules.id,
            lesson.moduleId
          )
        );

      if (!currentModule) {
        throw new Error(
          "Current module not found"
        );
      }

      // -----------------------------------------
      // Complete current module
      // -----------------------------------------

      await tx
        .update(modules)
        .set({
          status: "completed",
        })
        .where(
          eq(
            modules.id,
            currentModule.id
          )
        );

      // -----------------------------------------
      // Find next module
      // -----------------------------------------

      const [nextModule] = await tx
        .select()
        .from(modules)
        .where(
          and(
            eq(
              modules.roadmapId,
              currentModule.roadmapId
            ),
            gt(
              modules.order,
              currentModule.order
            )
          )
        )
        .orderBy(asc(modules.order))
        .limit(1);

      // -----------------------------------------
      // Next module exists
      // -----------------------------------------

      if (nextModule) {
        await tx
          .update(modules)
          .set({
            status: "active",
          })
          .where(
            eq(
              modules.id,
              nextModule.id
            )
          );

        // Find first lesson
        const [firstLesson] = await tx
          .select()
          .from(lessons)
          .where(
            eq(
              lessons.moduleId,
              nextModule.id
            )
          )
          .orderBy(asc(lessons.order))
          .limit(1);

        // Activate first lesson
        if (firstLesson) {
          await tx
            .update(lessons)
            .set({
              status: "active",
            })
            .where(
              eq(
                lessons.id,
                firstLesson.id
              )
            );
        }

        // Update roadmap
        await tx
          .update(roadmaps)
          .set({
            currentModule: nextModule.id,
          })
          .where(
            eq(
              roadmaps.id,
              currentModule.roadmapId
            )
          );

        return {
          message: "Module completed",
          nextModule,
          nextLesson: firstLesson,
          moduleCompleted: true,
        };
      }

      // -----------------------------------------
      // Roadmap completed
      // -----------------------------------------

      await tx
        .update(roadmaps)
        .set({
          status: "completed",
        })
        .where(
          eq(
            roadmaps.id,
            currentModule.roadmapId
          )
        );

      return {
        message: "Roadmap completed 🎉",
        nextLesson: null,
        moduleCompleted: true,
        roadmapCompleted: true,
      };
    }
  );

  // -----------------------------------------
  // Update streak
  // -----------------------------------------

  const updatedUser =
    await updateUserStreak(userId);

  // -----------------------------------------
  // Check achievements
  // -----------------------------------------

  const unlockedAchievements =
    await checkUserAchievements(userId);

  return {
    ...result,
    streak: updatedUser.streak,
    unlockedAchievements,
  };
}
