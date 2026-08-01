import { z } from "zod";

export const generateRoadmapSchema = z.object({
  career: z.string().min(2),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  dailyHours: z.number().min(1).max(12),
  goal: z.string().min(5),
});