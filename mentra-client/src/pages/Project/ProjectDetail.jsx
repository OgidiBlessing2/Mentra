import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ExternalLink,
  FolderKanban,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import {
  useProject,
  useProjects,
} from "../../hooks/useProjects";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
  } = useProject(id);

  const {
    updateProject,
    removeProject,
    isUpdating,
    isDeleting,
  } = useProjects();

  const project = data?.project ?? data;

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [status, setStatus] = useState("planned");

  // Load project information into the edit form
  useEffect(() => {
    if (!project) return;

    setTitle(project.title ?? "");
    setDescription(project.description ?? "");
    setGithubUrl(project.githubUrl ?? "");
    setLiveUrl(project.liveUrl ?? "");
    setStatus(project.status ?? "planned");
  }, [project]);

  // -----------------------------------------
  // Update Project
  // -----------------------------------------

  async function handleUpdateProject(e) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await updateProject({
        id,
        project: {
          title: title.trim(),
          description: description.trim(),
          githubUrl: githubUrl.trim(),
          liveUrl: liveUrl.trim(),
          status,
        },
      });

      setShowEdit(false);
    } catch (error) {
      console.error(
        "❌ Failed to update project:",
        error
      );
    }
  }

  // -----------------------------------------
  // Delete Project
  // -----------------------------------------

  async function handleDeleteProject() {
    try {
      await removeProject(id);

      navigate("/projects");
    } catch (error) {
      console.error(
        "❌ Failed to delete project:",
        error
      );
    }
  }

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />

            <p className="mt-4 text-slate-400">
              Loading project...
            </p>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-4xl">

          <button
            onClick={() => navigate("/projects")}
            className="mb-6 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>

          <div className="rounded-3xl border border-red-500/20 bg-[#18181B] p-8 text-center">

            <h1 className="text-2xl font-bold text-white">
              Project not found
            </h1>

            <p className="mt-2 text-slate-400">
              We couldn't load this project.
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mx-auto w-full max-w-5xl">

        {/* Back */}
        <button
          onClick={() => navigate("/projects")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        {/* Project */}
        <div className="rounded-[2rem] border border-white/10 bg-[#18181B] p-6 sm:p-8">

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <FolderKanban size={26} />
              </div>

              <div>

                <h1 className="text-3xl font-black text-white">
                  {project.title}
                </h1>

                <span className="mt-3 inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold capitalize text-violet-400">
                  {project.status}
                </span>

              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>

          </div>

          {/* Description */}
          {project.description && (
            <div className="mt-8 border-t border-white/10 pt-6">

              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Description
              </h2>

              <p className="mt-3 max-w-3xl whitespace-pre-wrap leading-7 text-slate-300">
                {project.description}
              </p>

            </div>
          )}

          {/* Links */}
          <div className="mt-8 flex flex-wrap gap-3">

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <span className="text-sm font-bold">
                  GH
                </span>

                GitHub

                <ExternalLink size={14} />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <ExternalLink size={17} />
                Open Live Project
              </a>
            )}

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* EDIT MODAL */}
      {/* ===================================== */}

      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowEdit(false);
            }
          }}
        >

          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#18181B] p-6 shadow-2xl sm:p-8">

            {/* Modal Header */}
            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Edit Project
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your project information.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleUpdateProject}
              className="mt-7 space-y-5"
            >

              {/* Title */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Project title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />

              </div>

              {/* GitHub */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  GitHub URL
                </label>

                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) =>
                    setGithubUrl(e.target.value)
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />

              </div>

              {/* Live URL */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Live URL
                </label>

                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) =>
                    setLiveUrl(e.target.value)
                  }
                  placeholder="https://your-project.com"
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />

              </div>

              {/* Status */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-violet-500"
                >
                  <option value="planned">
                    Planned
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>

              </div>

              {/* Save */}
              <button
                type="submit"
                disabled={
                  isUpdating ||
                  !title.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isUpdating ? (
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

      {/* ===================================== */}
      {/* DELETE MODAL */}
      {/* ===================================== */}

      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowDelete(false);
            }
          }}
        >

          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#18181B] p-6 shadow-2xl sm:p-8">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Delete Project?
            </h2>

            <p className="mt-3 leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {project.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() => setShowDelete(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}