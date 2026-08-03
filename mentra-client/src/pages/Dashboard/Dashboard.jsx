import DashboardLayout from "../../layout/DashboardLayout";
import HeroBanner from "../../components/dashboard/HeroBanner";
import StatCard from "../../components/dashboard/StatCard";
import { useDashboard } from "../../hooks/useDashboard";
import ContinueLearning from "./ContinueLearning";
import { Navigate } from "react-router-dom";
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
  
  // Hook
  const {
    data,
    isLoading,
    error,
  } = useDashboard();


 const dashboard = data?.dashboard;
const roadmap = dashboard?.roadmap;
  // Loading
  if (isLoading) {
    return <DashboardLayout>Loading... </DashboardLayout>;
  }

  if (!dashboard?.roadmap) {
    return <Navigate to="/onboarding" replace />;
}

  // Error
  if (error) {
    return <DashboardLayout>Something went wrong.</DashboardLayout>;
  }



  // Dashboard data


if (!data) {
  return (
    <DashboardLayout>
      Loading dashboard...
    </DashboardLayout>
  );
}
  // Stats
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

  // JSX
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

      <ContinueLearning />

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