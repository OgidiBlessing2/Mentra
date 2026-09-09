import DashboardLayout from "../../layout/DashboardLayout";
import { useRoadmap } from "../../hooks/useRoadmap";
import { useParams } from "react-router-dom";
import {
  Check,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";

import ModuleCard from "../../components/roadmap/ModuleCard";

export default function Roadmap() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useRoadmap(id);

  const roadmap = data?.roadmap;
  const modules = roadmap?.modules ?? [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />

            <p className="mt-4 text-slate-400">
              Loading your learning journey...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-red-400">
            Something went wrong loading your roadmap.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-400">
            Roadmap not found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const allLessons = modules.flatMap(
  (module) => module.lessons ?? []
);

const completedLessons = allLessons.filter(
  (lesson) => lesson.status === "completed"
).length;

const roadmapProgress =
  allLessons.length > 0
    ? Math.round(
        (completedLessons / allLessons.length) * 100
      )
    : 0;

  return (
    <DashboardLayout>

      <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">

        {/* ========================= */}
        {/* ROADMAP HEADER */}
        {/* ========================= */}

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600/20 via-[#18181B] to-cyan-600/10 p-6 sm:p-10">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="relative">

            <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
              <Sparkles size={16} />
              Your Learning Journey
            </div>

            <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              {roadmap.title}
            </h1>

            {roadmap.goal && (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                {roadmap.goal}
              </p>
            )}

            {/* Progress */}

            <div className="mt-7 max-w-xl">

              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="text-slate-400">
                  Your progress
                </span>

                <span className="font-bold text-white">
                  {roadmapProgress}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
                  style={{
                    width: `${roadmapProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* JOURNEY */}
        {/* ========================= */}

        <div className="mt-10">

          <div className="mb-8 text-center">

            <p className="text-sm font-medium text-slate-500">
              YOUR JOURNEY
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Let's build your skills step by step.
            </h2>

          </div>

          {/* Timeline */}

          <div className="relative">

            {/* Timeline line */}

            <div className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-emerald-500 via-violet-500 to-white/10 sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-10">

              {modules.map((module, index) => {

             const getModuleStatus = (module, index) => {
  const lessons = module.lessons ?? [];

  const completedCount = lessons.filter(
    (lesson) => lesson.status === "completed"
  ).length;

  const allCompleted =
    lessons.length > 0 &&
    completedCount === lessons.length;

  // Module completed
  if (allCompleted) {
    return "completed";
  }

  // First module is always available
  if (index === 0) {
    return "active";
  }

  // Check previous module
  const previousModule = modules[index - 1];

  const previousLessons =
    previousModule?.lessons ?? [];

  const previousCompleted =
    previousLessons.length > 0 &&
    previousLessons.every(
      (lesson) => lesson.status === "completed"
    );

  // Previous module completed → unlock this module
  if (previousCompleted) {
    return "active";
  }

  return "locked";
};

const status = getModuleStatus(module, index);
                const completed =
                  status === "completed";

                const active =
                  status === "active";

                const locked =
                  status === "locked";

                return (
                  <div
                    key={module.id}
                    className="relative flex items-start sm:items-center"
                  >

                    {/* Timeline node */}

                    <div
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#09090B] ${
                        completed
                          ? "bg-emerald-500 text-white"
                          : active
                          ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30"
                          : "bg-[#27272A] text-slate-500"
                      }`}
                    >

                      {completed ? (
                        <Check size={20} />
                      ) : active ? (
                        <Play
                          size={18}
                          fill="currentColor"
                        />
                      ) : (
                        <Lock size={17} />
                      )}

                    </div>

                    {/* Module */}

                    <div
                      className={`ml-5 w-full sm:ml-0 sm:w-[calc(50%-3rem)] ${
                        index % 2 === 0
                          ? "sm:mr-auto"
                          : "sm:ml-auto"
                      }`}
                    >

                      <div className="rounded-3xl">

                        {/* Status label */}

                        <div className="mb-3">

                          <p
                            className={`text-xs font-bold uppercase tracking-wider ${
                              completed
                                ? "text-emerald-400"
                                : active
                                ? "text-violet-400"
                                : "text-slate-500"
                            }`}
                          >
                            {completed
                              ? "Completed"
                              : active
                              ? "You're here"
                              : "Coming next"}
                          </p>

                        </div>

                        <ModuleCard
                          module={{
                            ...module,
                            status,
                          }}
                        />

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}