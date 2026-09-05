import DashboardLayout from "../../layout/DashboardLayout";
import HeroBanner from "../../components/dashboard/HeroBanner";
import StatCard from "../../components/dashboard/StatCard";
import AchievementCard from "../../components/dashboard/AchievementCard";
import { useDashboard } from "../../hooks/useDashboard";

import ContinueLearning from "./ContinueLearning";
import { useAchievements } from "../../hooks/useAchievements";

import {
  BookOpen,
  Route,
  Flame,
  Brain,
} from "lucide-react";

import TodaysGoal from "../../components/dashboard/TodaysGoal";
import RecentActivity from "../../components/dashboard/RecentActivity";
import AIMentorCard from "../../components/dashboard/AIMentorCard";

export default function Dashboard() {
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  const {
    achievements,
    isLoading: achievementsLoading,
  } = useAchievements();

  /* ============================= */
  /* LOADING */
  /* ============================= */

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <p className="text-lg text-[var(--mentra-text-muted)]">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  /* ============================= */
  /* ERROR */
  /* ============================= */

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] w-full items-center justify-center px-4 text-center">
          <p className="text-lg text-red-400">
            Something went wrong while loading your dashboard.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const dashboard = data?.dashboard;

  /* ============================= */
  /* NO DATA */
  /* ============================= */

  if (!dashboard) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] w-full items-center justify-center px-4 text-center">
          <p className="text-lg text-[var(--mentra-text-muted)]">
            No dashboard data found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const roadmap = dashboard.currentRoadmap;
  const currentLesson = dashboard.currentLesson;

  /* ============================= */
  /* NO ROADMAP */
  /* ============================= */

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <Route size={30} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[var(--mentra-text)] sm:text-3xl">
            Welcome to Mentra 👋
          </h1>

          <p className="mt-4 text-sm text-[var(--mentra-text-muted)] sm:text-base">
            Create your learning roadmap to start learning.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  /* ============================= */
  /* STATS */
  /* ============================= */

  const stats = [
    {
      title: "Lessons",
      value: dashboard.stats.completedLessons,
      icon: BookOpen,
      color: "#10B981",
    },
    {
      title: "Progress",
      value: `${dashboard.stats.progress}%`,
      icon: Route,
      color: "#3B82F6",
    },
    {
      title: "Streak",
      value: `${dashboard.stats.streak} Days`,
      icon: Flame,
      color: "#F59E0B",
    },
    {
      title: "Quizzes",
      value: dashboard.stats.completedQuizzes,
      icon: Brain,
      color: "#8B5CF6",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto w-full min-w-0 max-w-7xl">

        {/* ============================= */}
        {/* HERO */}
        {/* ============================= */}

        <section className="w-full min-w-0">
          <HeroBanner />
        </section>

        {/* ============================= */}
        {/* STATS */}
        {/* ============================= */}

        <section className="mt-6 w-full min-w-0 sm:mt-8">
          <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="min-w-0"
              >
                <StatCard
                  {...stat}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ============================= */}
        {/* LEARNING + AI MENTOR */}
        {/* ============================= */}

        <section className="mt-6 w-full min-w-0 sm:mt-8">
          <div className="grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="min-w-0">
              <ContinueLearning
                lesson={currentLesson}
                roadmap={roadmap}
              />
            </div>

            <div className="min-w-0">
              <AIMentorCard />
            </div>

          </div>
        </section>

        {/* ============================= */}
        {/* ACHIEVEMENTS */}
        {/* ============================= */}

        <section className="mt-6 w-full min-w-0 sm:mt-8">
          <AchievementCard
            achievements={achievements}
            isLoading={achievementsLoading}
          />
        </section>

        {/* ============================= */}
        {/* TODAY + ACTIVITY */}
        {/* ============================= */}

        <section className="mt-6 w-full min-w-0 sm:mt-8">
          <div className="grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="min-w-0">
              <TodaysGoal />
            </div>

            <div className="min-w-0">
              <RecentActivity />
            </div>

          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}