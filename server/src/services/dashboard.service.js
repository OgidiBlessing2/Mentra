import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { roadmaps } from "../db/schema/roadmaps.js";

export async function getDashboardService(userId) {
  const [roadmap] = await db
  .select()
  .from(roadmaps)
  .limit(1);

  return {
    roadmap,
  };
}