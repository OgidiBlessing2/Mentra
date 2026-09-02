
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { useProjects } from "../../hooks/useProjects";

import {
  FolderKanban,
  Plus,
  Rocket,
  ExternalLink,
  X,
  ArrowRight,
} from "lucide-react";

export default function Projects() {
  const {
    projects,
    isLoading,
    addProject,
    isCreating,
  } = useProjects();

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [status, setStatus] = useState("planned");

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setShowForm(false);
      }
    }

    if (showForm) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showForm]);

  async function handleCreateProject(e) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await addProject({
        title: title.trim(),
        description: description.trim(),
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl.trim(),
        status,
      });

      setTitle("");
      setDescription("");
      setGithubUrl("");
      setLiveUrl("");
      setStatus("planned");

      setShowForm(false);
    } catch (error) {
      console.error("❌ Failed to create project:", error);
    }
  }

  function openProject(projectId) {
    if (!projectId) {
      console.error("❌ Project ID is missing");
      return;
    }

    console.log("📂 Opening project:", projectId);

    navigate(`/projects/${projectId}`);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <FolderKanban size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                Projects
              </h1>

              <p className="mt-1 text-slate-400">
                Build real projects and track your progress.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
          >
            <Plus size={18} />
            New Project
          </button>

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />

              <p className="mt-4 text-slate-400">
                Loading projects...
              </p>

            </div>
          </div>
        )}

        {/* Projects */}
        {!isLoading && projects.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => openProject(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openProject(project.id);
                  }
                }}
                className="group cursor-pointer rounded-3xl border border-white/10 bg-[#18181B] p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5"
              >

                {/* Card top */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <FolderKanban size={21} />
                  </div>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-400">
                    {project.status}
                  </span>

                </div>

                {/* Project information */}
                <h2 className="mt-5 text-xl font-bold text-white">
                  {project.title}
                </h2>

                {project.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>
                )}

                {/* Links */}
                <div className="mt-6 flex flex-wrap gap-3">

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <span className="text-sm font-bold">
                        GH
                      </span>

                      GitHub
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <ExternalLink size={16} />
                      Live
                    </a>
                  )}

                </div>

                {/* Open project */}
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">

                  <span className="text-sm font-medium text-slate-500 transition group-hover:text-violet-400">
                    Open project
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
                  />

                </div>

              </div>
            ))}

          </div>
        )}

        {/* Empty state */}
        {!isLoading && projects.length === 0 && (
          <div className="mt-10 flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#18181B] px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-400">
              <Rocket size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              Start building something
            </h2>

            <p className="mt-3 max-w-md leading-7 text-slate-400">
              Create your first project and start building your portfolio.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-7 flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-slate-200"
            >
              <Plus size={18} />
              Create your first project
            </button>

          </div>
        )}

      </div>

      {/* Create Project Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
            }
          }}
        >

          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#18181B] p-6 shadow-2xl sm:p-8">

            {/* Modal header */}
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create Project
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Add a project you're working on.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateProject}
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mentra"
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
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you building?"
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
                  onChange={(e) => setGithubUrl(e.target.value)}
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
                  onChange={(e) => setLiveUrl(e.target.value)}
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
                  onChange={(e) => setStatus(e.target.value)}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating || !title.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Project
                  </>
                )}
              </button>

            </form>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}
