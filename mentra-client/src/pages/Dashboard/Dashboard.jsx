
import DashboardLayout from "../../layout/DashboardLayout";
import HeroBanner from "../../components/dashboard/HeroBanner";
import StatCard from "../../components/dashboard/StatCard";

import { useDashboard } from "../../hooks/useDashboard";

import ContinueLearning from "./ContinueLearning";

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

  // -----------------------------
  // Loading
  // -----------------------------

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg text-red-400">
            Something went wrong while loading your dashboard.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------
  // Dashboard data
  // -----------------------------

  const dashboard = data?.dashboard;

  if (!dashboard) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg text-slate-400">
            No dashboard data found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const roadmap = dashboard.currentRoadmap;
  const currentLesson = dashboard.currentLesson;

  // -----------------------------
  // No roadmap
  // -----------------------------

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl py-20 text-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome to Mentra 👋
          </h1>

          <p className="mt-4 text-slate-400">
            Create your learning roadmap to start learning.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------
  // Stats
  // -----------------------------

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

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <DashboardLayout>

      {/* Hero */}
      <HeroBanner />

      {/* Stats */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      {/* Continue Learning + AI Mentor */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        <ContinueLearning
          lesson={currentLesson}
          roadmap={roadmap}
        />

        <AIMentorCard />

      </div>

      {/* Today's Goal + Recent Activity */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        <TodaysGoal />

        <RecentActivity />

      </div>

    </DashboardLayout>
  );
}
