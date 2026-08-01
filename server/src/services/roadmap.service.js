import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { roadmaps } from "../db/schema/roadmaps.js";
import { modules } from "../db/schema/modules.js";
import { buildRoadmapPrompt } from "../prompts/roadmap.prompt.js";
import { generateRoadmap } from "./ai.service.js";
import { lessons } from "../db/schema/lesson.js";

export async function generateRoadmapService(userId, request) {
  const prompt = buildRoadmapPrompt(request);

  const result = await generateRoadmap(prompt);

  const cleanJson = result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const data = JSON.parse(cleanJson);

  console.log(JSON.stringify(data, null, 2));


  let savedRoadmap;

  await db.transaction(async (tx) => {
    [savedRoadmap] = await tx
      .insert(roadmaps)
    .values({
  userId,
  title: data.roadmap.title,
  career: request.career,
  level: request.level,
  goal: request.goal,
})
      .returning();

    const [savedModule] = await tx
      .insert(modules)
      .values({
        roadmapId: savedRoadmap.id,
      title: data.module.title,
      description: data.module.description,
      estimatedDays: data.module.estimatedDays,
        order: 1,
        status: "active",
      })
      .returning();

    const lessonRows = data.lessons.map((lesson, index) => ({
      moduleId: savedModule.id,
      title: lesson.title,
      description: lesson.description,
      estimatedMinutes: lesson.estimatedMinutes,
      project: lesson.project,
      order: index + 1,
      status: index === 0 ? "active" : "locked",
    }));
      await tx.insert(lessons).values(lessonRows);

    await tx
      .update(roadmaps)
      .set({
        currentModule: savedModule.id,
      })
      .where(eq(roadmaps.id, savedRoadmap.id));
  });

  return {
    roadmap: savedRoadmap,
    ai: data,
  };
}



export async function getRoadmapService(id) {

  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.id, id));

    const roadmapModules = await db
    .select()
    .from(modules)
    .where(eq(modules.roadmapId, roadmap.id))
    .orderBy(modules.order);

    const modulesWithLessons = await Promise.all(
      roadmapModules.map(async (module) => {
    const moduleLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, module.id))
      .orderBy(lessons.order);

    return {
      ...module,
      lessons: moduleLessons,
    };
  })
);

  if (!roadmap) {
    throw new Error("Roadmap not found");
  }

  return {
  ...roadmap,
  modules: modulesWithLessons,
  }

}