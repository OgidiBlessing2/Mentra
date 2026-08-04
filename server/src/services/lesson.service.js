import { and, eq, gt, asc } from "drizzle-orm";
import { db } from "../db/index.js";

import { lessons } from "../db/schema/lesson.js";
import { modules } from "../db/schema/modules.js";
import { roadmaps } from "../db/schema/roadmaps.js";

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

  return {
    ...lesson,
    module,
  };
}

/*
|--------------------------------------------------------------------------
| Complete Lesson
|--------------------------------------------------------------------------
*/

export async function completeLessonService(id) {
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

      // First lesson of next module
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

      // Update current module on roadmap
      await tx
        .update(roadmaps)
        .set({
          currentModule: nextModule.id,
        })
        .where(eq(roadmaps.id, currentModule.roadmapId));

      return {
        message: "Module completed",
        nextModule,
      };
    }

    return {
      message: "Roadmap completed 🎉",
    };
  });
}