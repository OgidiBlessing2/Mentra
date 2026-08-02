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

export default function Dashboard() {

  // Hook
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  // Loading
  if (isLoading) {
    return <DashboardLayout>Loading... </DashboardLayout>;
  }

  // Error
  if (error) {
    return <DashboardLayout>Something went wrong.</DashboardLayout>;
  }

  // Dashboard data
  const dashboard = data.dashboard;
  const roadmap = dashboard.currentRoadmap;

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

      <HeroBanner
        title={roadmap.title}
        progress={dashboard.stats.progress}
      />

      <div className="grid grid-cols-4 gap-6 mt-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />

        
        ))}

          <ContinueLearning 
          lesson={dashboard.currentLesson} 
          />

      </div>

    </DashboardLayout>
  );
}