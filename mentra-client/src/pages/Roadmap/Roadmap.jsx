import DashboardLayout from "../../layout/DashboardLayout";
import { useRoadmap } from "../../hooks/useRoadmap";

import ProgressHeader from "../../components/roadmap/ProgressHeader";
import ModuleCard from "../../components/roadmap/ModuleCard";

export default function Roadmap() {

  const {
    data,
    loading,
    error,
  } = useRoadmap();

  if (loading) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        Something went wrong.
      </DashboardLayout>
    );
  }

  const roadmap = data.roadmap;

  return (
    <DashboardLayout>

      <ProgressHeader
        roadmap={roadmap}
      />

      {roadmap.modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
        />
      ))}

    </DashboardLayout>
  );
}