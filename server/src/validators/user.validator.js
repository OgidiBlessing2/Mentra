import { z } from "zod";

export const createUserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.email(),
  name: z.string().min(2).max(100),
});