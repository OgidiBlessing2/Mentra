import { eq, and, asc } from "drizzle-orm";

import { db } from "../db/index.js";
import { projectTasks } from "../db/schema/projectTasks.js";
import { projects } from "../db/schema/projects.js";

export const getProjectTasksService = async (userId, projectId) => {
  console.log("🔎 TASK DEBUG");
  console.log("Project ID:", projectId);
  console.log("Current Clerk User ID:", userId);

  const projectById = await db
    .select({
      id: projects.id,
      userId: projects.userId,
      title: projects.title,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  console.log("Project found by ID:", projectById);

  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      )
    )
    .limit(1);

  console.log("Project found with ownership check:", project);

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  return await db
    .select()
    .from(projectTasks)
    .where(eq(projectTasks.projectId, projectId))
    .orderBy(
      asc(projectTasks.position),
      asc(projectTasks.createdAt)
    );
};


// Create a task
export const createProjectTaskService = async (
  userId,
  projectId,
  data
) => {
  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      )
    )
    .limit(1);

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  const [task] = await db
    .insert(projectTasks)
    .values({
      projectId,
      title: data.title,
      description: data.description || null,
      status: data.status || "todo",
      priority: data.priority || "medium",
      dueDate: data.dueDate || null,
      position: data.position || 0,
    })
    .returning();

  return task;
};


// Update a task
export const updateProjectTaskService = async (
  userId,
  projectId,
  taskId,
  data
) => {
  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      )
    )
    .limit(1);

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  const [task] = await db
    .update(projectTasks)
    .set({
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.priority !== undefined && {
        priority: data.priority,
      }),

      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate || null,
      }),

      ...(data.position !== undefined && {
        position: data.position,
      }),

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(projectTasks.id, taskId),
        eq(projectTasks.projectId, projectId)
      )
    )
    .returning();

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};


// Delete a task
export const deleteProjectTaskService = async (
  userId,
  projectId,
  taskId
) => {
  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      )
    )
    .limit(1);

  if (project.length === 0) {
    throw new Error("Project not found");
  }

  const [task] = await db
    .delete(projectTasks)
    .where(
      and(
        eq(projectTasks.id, taskId),
        eq(projectTasks.projectId, projectId)
      )
    )
    .returning();

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};