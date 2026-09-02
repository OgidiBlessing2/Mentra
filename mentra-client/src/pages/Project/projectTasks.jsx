
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { useProjectTasks } from "../../hooks/useProjectTasks.js";

export default function ProjectTasks({ projectId }) {
  const navigate = useNavigate();

  const {
    tasks = [],
    isLoading,
    isError,
    createTask,
    updateTask,
    deleteTask,
  } = useProjectTasks(projectId);

  // -----------------------------------------
  // Create task state
  // -----------------------------------------

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  // -----------------------------------------
  // Edit task state
  // -----------------------------------------

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // -----------------------------------------
  // Create task
  // -----------------------------------------

  async function handleCreateTask(e) {
  e.preventDefault();

  console.log("🔥 FORM SUBMITTED");
  console.log("projectId:", projectId);
  console.log("title:", title);
  console.log("description:", description);
  console.log("createTask:", createTask);
  console.log("createTask.mutateAsync:", createTask?.mutateAsync);

  if (!title.trim()) {
    console.log("❌ Title is empty");
    return;
  }

  if (!createTask?.mutateAsync) {
    console.error("❌ createTask.mutateAsync does not exist");
    return;
  }

  try {
    console.log("🚀 ABOUT TO CALL createTask.mutateAsync");

    const result = await createTask.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      status: "todo",
      position: tasks.length,
    });

    console.log("✅ CREATE TASK RESULT:", result);

    setTitle("");
    setDescription("");
    setShowForm(false);
  } catch (error) {
    console.error("❌ CREATE TASK FAILED");
    console.error("Error:", error);
    console.error("Response:", error?.response);
    console.error("Response data:", error?.response?.data);
    console.error("Status:", error?.response?.status);
  }
}

  // -----------------------------------------
  // Toggle task completion
  // -----------------------------------------

  async function handleToggleTask(task) {
    try {
      console.log("🔄 Updating task:", task.id);

      await updateTask.mutateAsync({
        taskId: task.id,
        data: {
          status:
            task.status === "completed"
              ? "todo"
              : "completed",
        },
      });

      console.log("✅ Task updated");
    } catch (error) {
      console.error(
        "❌ Failed to update task:",
        error?.response?.data || error
      );
    }
  }

  // -----------------------------------------
  // Start editing
  // -----------------------------------------

  function startEditing(task) {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
  }

  // -----------------------------------------
  // Update task
  // -----------------------------------------

  async function handleUpdateTask(e) {
    e.preventDefault();

    if (!editingTask || !editTitle.trim()) {
      return;
    }

    if (updateTask.isPending) {
      return;
    }

    try {
      console.log("✏️ Updating task:", editingTask.id);

      await updateTask.mutateAsync({
        taskId: editingTask.id,
        data: {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
      });

      console.log("✅ Task updated successfully");

      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
    } catch (error) {
      console.error(
        "❌ Failed to update task:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update task. Please try again."
      );
    }
  }

  // -----------------------------------------
  // Delete task
  // -----------------------------------------

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log("🗑️ Deleting task:", taskId);

      await deleteTask.mutateAsync(taskId);

      console.log("✅ Task deleted successfully");
    } catch (error) {
      console.error(
        "❌ Failed to delete task:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete task. Please try again."
      );
    }
  }

  // -----------------------------------------
  // Open create modal
  // -----------------------------------------

  function openCreateModal() {
    setTitle("");
    setDescription("");
    setShowForm(true);
  }

  // -----------------------------------------
  // Close create modal
  // -----------------------------------------

  function closeCreateModal() {
    if (createTask.isPending) {
      return;
    }

    setTitle("");
    setDescription("");
    setShowForm(false);
  }

  // -----------------------------------------
  // Progress
  // -----------------------------------------

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  // -----------------------------------------
  // Render
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              title="Back to projects"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-sm font-medium text-violet-400">
                Project Tasks
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Tasks
              </h1>

              <p className="mt-1 text-slate-400">
                Break your project into smaller steps and track your progress.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-5 py-3 font-bold shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
          >
            <Plus size={18} />
            Add Task
          </button>

        </div>

        {/* Progress */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#18181B] p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-400">
                Project progress
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {progress}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />

              <p className="mt-4 text-slate-400">
                Loading tasks...
              </p>

            </div>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

            <h2 className="text-xl font-bold text-white">
              Unable to load tasks
            </h2>

            <p className="mt-2 text-slate-400">
              Something went wrong while loading this project's tasks.
            </p>

          </div>
        )}

        {/* Tasks */}
        {!isLoading && !isError && (
          <div className="mt-8 space-y-3">

            {tasks.length > 0 ? (
              tasks.map((task) => {
                const isCompleted =
                  task.status === "completed";

                return (
                  <div
                    key={task.id}
                    className={`group rounded-2xl border p-5 transition ${
                      isCompleted
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-white/10 bg-[#18181B] hover:border-violet-500/30"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      {/* Complete */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        disabled={updateTask.isPending}
                        className="mt-1 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                        title={
                          isCompleted
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle2
                            size={24}
                            className="text-emerald-400"
                          />
                        ) : (
                          <Circle
                            size={24}
                            className="text-slate-500 transition group-hover:text-violet-400"
                          />
                        )}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <h2
                          className={`font-bold ${
                            isCompleted
                              ? "text-slate-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h2>

                        {task.description && (
                          <p
                            className={`mt-1 text-sm leading-6 ${
                              isCompleted
                                ? "text-slate-600"
                                : "text-slate-400"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        {/* Status */}
                        <div className="mt-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-400"
                                : task.status === "in-progress"
                                ? "bg-cyan-500/10 text-cyan-400"
                                : "bg-violet-500/10 text-violet-400"
                            }`}
                          >
                            {task.status === "in-progress"
                              ? "In Progress"
                              : task.status}
                          </span>
                        </div>

                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">

                        <button
                          type="button"
                          onClick={() => startEditing(task)}
                          disabled={
                            updateTask.isPending ||
                            deleteTask.isPending
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          title="Edit task"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deleteTask.isPending}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete task"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#18181B] px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                  <CheckCircle2 size={30} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  No tasks yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Add your first task to start breaking this project into manageable steps.
                </p>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:bg-slate-200"
                >
                  <Plus size={18} />
                  Add your first task
                </button>

              </div>
            )}

          </div>
        )}

      </div>

      {/* -----------------------------------------
          Add Task Modal
      ----------------------------------------- */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeCreateModal();
            }
          }}
        >

          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#18181B] p-6 shadow-2xl sm:p-8">

            {/* Modal header */}
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Add Task
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  What do you need to build next?
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={createTask.isPending}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                title="Close"
              >
                <X size={21} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateTask}
              className="mt-7 space-y-5"
            >

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Task title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build project dashboard"
                  required
                  autoFocus
                  disabled={createTask.isPending}
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what needs to be done..."
                  rows={4}
                  disabled={createTask.isPending}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Submit */}
            <button
  type="submit"
  disabled={createTask?.isPending || !title.trim()}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
>
  {createTask?.isPending ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      Creating Task...
    </>
  ) : (
    <>
      <Plus size={18} />
      Add Task
    </>
  )}
</button>

            </form>

          </div>

        </div>
      )}

      {/* -----------------------------------------
          Edit Task Modal
      ----------------------------------------- */}

      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setEditingTask(null);
            }
          }}
        >

          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#18181B] p-6 shadow-2xl sm:p-8">

            {/* Modal header */}
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Edit Task
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your task details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingTask(null)}
                disabled={updateTask.isPending}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                title="Close"
              >
                <X size={21} />
              </button>

            </div>

            {/* Edit form */}
            <form
              onSubmit={handleUpdateTask}
              className="mt-7 space-y-5"
            >

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Task title
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  disabled={updateTask.isPending}
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  rows={4}
                  disabled={updateTask.isPending}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  updateTask.isPending ||
                  !editTitle.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateTask.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pencil size={18} />
                    Save Changes
                  </>
                )}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
