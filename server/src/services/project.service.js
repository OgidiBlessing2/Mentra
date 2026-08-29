import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { projects } from "../db/schema/projects.js";


// -----------------------------------------
// Create Project
// -----------------------------------------

export async function createProjectService(userId, data) {
  const [project] = await db
    .insert(projects)
    .values({
      userId,
      title: data.title,
      description: data.description || null,
      githubUrl: data.githubUrl || null,
      liveUrl: data.liveUrl || null,
      status: data.status || "planned",
    })
    .returning();

  return project;
}


// -----------------------------------------
// Get User Projects
// -----------------------------------------

export async function getProjectsService(userId) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));

  return userProjects;
}


// -----------------------------------------
// Get Single Project
// -----------------------------------------

export async function getProjectService(userId, id) {
  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.id, id),
        eq(projects.userId, userId)
      )
    );

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}


// -----------------------------------------
// Update Project
// -----------------------------------------

export async function updateProjectService(
  userId,
  id,
  data
) {
  const [project] = await db
    .update(projects)
    .set({
      title: data.title,
      description: data.description || null,
      githubUrl: data.githubUrl || null,
      liveUrl: data.liveUrl || null,
      status: data.status || "planned",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(projects.id, id),
        eq(projects.userId, userId)
      )
    )
    .returning();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}


// -----------------------------------------
// Delete Project
// -----------------------------------------

export async function deleteProjectService(
  userId,
  id
) {
  const [project] = await db
    .delete(projects)
    .where(
      and(
        eq(projects.id, id),
        eq(projects.userId, userId)
      )
    )
    .returning();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}