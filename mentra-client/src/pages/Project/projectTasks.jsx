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
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // -----------------------------------------
  // Edit task state
  // -----------------------------------------

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");

  const [taskSort, setTaskSort] = useState("position");

  // -----------------------------------------
  // Create task
  // -----------------------------------------

  async function handleCreateTask(e) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (!createTask?.mutateAsync) {
      console.error("❌ createTask.mutateAsync does not exist");
      return;
    }

    try {d
      const result = await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        status: "todo",
        priority,
        dueDate: dueDate || null,
        position: tasks.length,
      });

      console.log("✅ CREATE TASK RESULT:", result);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setShowForm(false);
    } catch (error) {
      console.error(
        "❌ CREATE TASK FAILED:",
        error?.response?.data || error
      );
    }
  }

  // -----------------------------------------
  // Toggle task completion
  // -----------------------------------------

  async function handleToggleTask(task) {
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        data: {
          status:
            task.status === "completed"
              ? "todo"
              : "completed",
        },
      });
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
    setEditPriority(task.priority || "medium");
    setEditDueDate(task.dueDate || "");
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
      await updateTask.mutateAsync({
        taskId: editingTask.id,
        data: {
          title: editTitle.trim(),
          description: editDescription.trim(),
          priority: editPriority,
          dueDate: editDueDate || null,
        },
      });

      console.log("✅ Task updated successfully");

      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
      setEditPriority("medium");
      setEditDueDate("");
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

  async function handleDrop(targetTaskId) {
  if (!draggedTaskId || draggedTaskId === targetTaskId) {
    setDraggedTaskId(null);
    return;
  }

  const currentTasks = [...tasks];

  const draggedIndex = currentTasks.findIndex(
    (task) => task.id === draggedTaskId
  );

  const targetIndex = currentTasks.findIndex(
    (task) => task.id === targetTaskId
  );

  if (draggedIndex === -1 || targetIndex === -1) {
    setDraggedTaskId(null);
    return;
  }

  const [draggedTask] = currentTasks.splice(draggedIndex, 1);

  currentTasks.splice(targetIndex, 0, draggedTask);

  setDraggedTaskId(null);

  try {
    for (let index = 0; index < currentTasks.length; index++) {
      await updateTask.mutateAsync({
        taskId: currentTasks[index].id,
        data: {
          position: index,
        },
      });
    }

    console.log("✅ Task order saved");
  } catch (error) {
    console.error(
      "❌ Failed to save task order:",
      error?.response?.data || error
    );
  }
}  // -----------------------------------------
  // Open create modal
  // -----------------------------------------

  function openCreateModal() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
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
    setPriority("medium");
    setDueDate("");
    setShowForm(false);
  }

// -----------------------------------------
// Overdue detection
// -----------------------------------------

function isTaskOverdue(task) {
  if (!task.dueDate || task.status === "completed") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

const filteredTasks = tasks.filter((task) => {
  switch (taskFilter) {
    case "active":
      return task.status !== "completed";

    case "completed":
      return task.status === "completed";

    case "high":
      return task.priority === "high";

    case "overdue":
      return isTaskOverdue(task);

    case "all":
    default:
      return true;
  }
});
const sortedTasks = [...filteredTasks].sort((a, b) => {
  switch (taskSort) {
    case "priority": {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return (
        priorityOrder[a.priority || "medium"] -
        priorityOrder[b.priority || "medium"]
      );
    }

    case "dueDate": {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return (
        new Date(a.dueDate) -
        new Date(b.dueDate)
      );
    }

    case "newest":
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );

    case "oldest":
      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );

    case "position":
    default:
      return (a.position || 0) - (b.position || 0);
  }
});
 const filterEmptyMessage = {
  all: "Add your first task to start breaking this project into manageable steps.",
  active: "You have no active tasks.",
  completed: "You have not completed any tasks yet.",
  high: "You have no high-priority tasks.",
  overdue: "You have no overdue tasks. Nice work!",
}[taskFilter];


const todoTasks = tasks.filter(
  (task) => task.status === "todo"
).length;

const inProgressTasks = tasks.filter(
  (task) => task.status === "in-progress"
).length;

const completedTaskCount = tasks.filter(
  (task) => task.status === "completed"
).length;

const highPriorityTasks = tasks.filter(
  (task) => task.priority === "high"
).length;

const overdueTasks = tasks.filter(
  (task) => isTaskOverdue(task)
).length;

const activeTasks =
  todoTasks + inProgressTasks;

const analyticsBars = [
  {
    id: "active",
    label: "Active",
    count: activeTasks,
    filter: "active",
  },
  {
    id: "completed",
    label: "Completed",
    count: completedTaskCount,
    filter: "completed",
  },
  {
    id: "high",
    label: "High Priority",
    count: highPriorityTasks,
    filter: "high",
  },
  {
    id: "overdue",
    label: "Overdue",
    count: overdueTasks,
    filter: "overdue",
  },
];

const maxAnalyticsValue = Math.max(
  ...analyticsBars.map((bar) => bar.count),
  1
);


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

        {/* Project Analytics */}
<div className="mt-8">
  <div className="mb-4">
    <p className="text-sm font-medium text-violet-400">
      Project Analytics
    </p>

    <h2 className="mt-1 text-2xl font-black text-white">
      Task Overview
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Track your project workload and progress at a glance.
    </p>
  </div>

  <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

    {/* Interactive Bar Chart */}
    <div className="rounded-3xl border border-white/10 bg-[#18181B] p-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Task Breakdown
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Click a bar to filter tasks
          </p>
        </div>

        <div className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400">
          {totalTasks} total
        </div>
      </div>

      <div className="mt-7 space-y-5">

        {analyticsBars.map((bar) => {
          const width =
            bar.count === 0
              ? 0
              : Math.max(
                  (bar.count / maxAnalyticsValue) * 100,
                  8
                );

          const isSelected =
            taskFilter === bar.filter;

          return (
            <button
              key={bar.id}
              type="button"
              onClick={() => setTaskFilter(bar.filter)}
              className="group w-full text-left"
            >
              <div className="mb-2 flex items-center justify-between">

                <span
                  className={`text-sm font-semibold transition ${
                    isSelected
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {bar.label}
                </span>

                <span className="text-sm font-bold text-white">
                  {bar.count}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/5">

                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSelected
                      ? "bg-gradient-to-r from-violet-500 to-cyan-400"
                      : "bg-white/20 group-hover:bg-white/30"
                  }`}
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>
            </button>
          );
        })}

      </div>
    </div>

    <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-[#18181B] px-4 py-3">
  <span className="text-sm font-medium text-slate-400">
    Sort tasks
  </span>

  <select
    value={taskSort}
    onChange={(e) => setTaskSort(e.target.value)}
    className="rounded-xl border border-white/10 bg-[#232326] px-3 py-2 text-sm font-semibold text-white outline-none focus:border-violet-500"
  >
    <option value="position">Position</option>
    <option value="priority">Priority</option>
    <option value="dueDate">Due Date</option>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>

    {/* Project Stats */}
    <div className="rounded-3xl border border-white/10 bg-[#18181B] p-6">

      <div>
        <p className="text-sm font-semibold text-white">
          Project Stats
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Current project health
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">
            Total
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {totalTasks}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">
            Completed
          </p>

          <p className="mt-1 text-2xl font-black text-emerald-400">
            {completedTaskCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">
            Active
          </p>

          <p className="mt-1 text-2xl font-black text-cyan-400">
            {activeTasks}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-500">
            Overdue
          </p>

          <p className="mt-1 text-2xl font-black text-red-400">
            {overdueTasks}
          </p>
        </div>

      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            High priority
          </span>

          <span className="font-bold text-amber-400">
            {highPriorityTasks}
          </span>
        </div>

      </div>

    </div>

  </div>
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

        <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#18181B] p-2">
  {[
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "high", label: "High Priority" },
    { id: "overdue", label: "Overdue" },
  ].map((filter) => (
    <button
      key={filter.id}
      type="button"
      onClick={() => setTaskFilter(filter.id)}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        taskFilter === filter.id
          ? "bg-white text-black"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {filter.label}
    </button>
  ))}
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

            <h2 className="text-xl font-bold">
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

            {sortedTasks.length > 0 ? ( 
              sortedTasks.map((task) => {
  const isCompleted =
    task.status === "completed";

  const isOverdue = isTaskOverdue(task);

 

                return (
                  <div
  key={task.id}
  draggable
  onDragStart={(e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
    setDraggedTaskId(task.id);
  }}
  onDragEnd={() => {
    setDraggedTaskId(null);
  }}
  onDragOver={(e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }}
  onDrop={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDrop(task.id);
  }}
  className={`group rounded-2xl border p-5 transition ${
    isCompleted
      ? "border-emerald-500/20 bg-emerald-500/5"
      : "border-white/10 bg-[#18181B] hover:border-violet-500/30"
  } ${
    draggedTaskId === task.id
      ? "scale-[0.98] opacity-50"
      : ""
  }`}
>

                    <div className="flex items-start gap-4">
                      <div
  className="mt-1 cursor-grab select-none text-slate-600 transition hover:text-slate-300 active:cursor-grabbing"
  title="Drag to reorder"
>
  ⋮⋮
</div>

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

                        {/* Task metadata */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          {/* Status */}
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

                          {/* Priority */}
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              task.priority === "high"
                                ? "bg-red-500/10 text-red-400"
                                : task.priority === "low"
                                ? "bg-slate-500/10 text-slate-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {task.priority || "medium"} priority
                          </span>

                          {/* Due date */}
                          {task.dueDate && (
                            <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
                              📅 {task.dueDate}
                            </span>
                          )}

                        </div>


                        {/* Status control */}
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTask.mutate({
                              taskId: task.id,
                              data: {
                                status: e.target.value,
                              },
                            })
                          }
                          disabled={updateTask.isPending}
                          className="mt-3 rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

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

              <h3>
  {taskFilter === "all" ? "No tasks yet" : "No matching tasks"}
</h3>

               <p className="mt-2 text-sm text-slate-400">
  {filterEmptyMessage}
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

              {/* Priority + Due Date */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={createTask.isPending}
                    className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Due date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={createTask.isPending}
                    className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  createTask.isPending ||
                  !title.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createTask.isPending ? (
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

              {/* Priority + Due Date */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Priority
                  </label>

                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(e.target.value)
                    }
                    disabled={updateTask.isPending}
                    className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Due date
                  </label>

                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) =>
                      setEditDueDate(e.target.value)
                    }
                    disabled={updateTask.isPending}
                    className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

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