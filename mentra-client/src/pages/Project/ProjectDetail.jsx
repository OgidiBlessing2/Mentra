
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
} from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import ProjectTasks from "./ProjectTasks.jsx";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>


        {/* Project header */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-[#18181B] p-6 sm:p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <FolderKanban size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Project Tasks
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Plan, organize, and track the work for this project.
              </p>
            </div>

          </div>

        </div>


        {/* Tasks */}
        <ProjectTasks projectId={projectId} />

      </div>
    </DashboardLayout>
  );
}
