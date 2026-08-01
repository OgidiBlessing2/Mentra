import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { lessons } from "../db/schema/lesson.js";
import { roadmaps } from "../db/schema/roadmaps.js";
import { modules } from "../db/schema/modules.js";

export async function completeLessonService(id) {

  return await db.transaction(async (tx) => {

    const [lesson] = await tx
      .select()
      .from(lessons)
      .where(eq(lessons.id, id));

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const [completedLesson] = await tx
      .update(lessons)
      .set({
        status: "completed",
      })
      .where(eq(lessons.id, id))
      .returning();

    const [nextLesson] = await tx
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, lesson.moduleId),
          eq(lessons.order, lesson.order + 1)
        )
      );

    if (nextLesson) {
      await tx
        .update(lessons)
        .set({
          status: "active",
        })
        .where(eq(lessons.id, nextLesson.id));
    }

      if (!nextLesson) {

  // 1. Get the current module
  const [currentModule] = await tx
    .select()
    .from(modules)
    .where(eq(modules.id, lesson.moduleId));

  // 2. Mark the current module as completed
  await tx
    .update(modules)
    .set({
      status: "completed",
    })
    .where(eq(modules.id, lesson.moduleId));

  // 3. 👇 Find the next module (THIS IS THE CODE YOU'RE ASKING ABOUT)
  const [nextModule] = await tx
    .select()
    .from(modules)
    .where(
      and(
        eq(modules.roadmapId, currentModule.roadmapId),
        eq(modules.order, currentModule.order + 1)
      )
    );

}


   // If there is another module...
  if (nextModule) {

    // Activate it
    await tx
      .update(modules)
      .set({
        status: "active",
      })
      .where(eq(modules.id, nextModule.id));

    // Unlock its first lesson
    const [firstLesson] = await tx
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, nextModule.id),
          eq(lessons.order, 1)
        )
      );

    if (firstLesson) {
      await tx
        .update(lessons)
        .set({
          status: "active",
        })
        .where(eq(lessons.id, firstLesson.id));
    }

    // 👇 THIS GOES HERE
    await tx
      .update(roadmaps)
      .set({
        currentModule: nextModule.id,
      })
      .where(eq(roadmaps.id, currentModule.roadmapId));
  }


    return completedLesson;
  });

}
  
