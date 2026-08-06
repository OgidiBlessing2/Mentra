import DashboardLayout from "../../layout/DashboardLayout";
import { useRoadmap } from "../../hooks/useRoadmap";

import ProgressHeader from "../../components/roadmap/ProgressHeader";
import ModuleCard from "../../components/roadmap/ModuleCard";
import { useParams } from "react-router-dom";


export default function Roadmap() {

  const { id } = useParams();

const {
  data,
  isLoading,
  error,
} = useRoadmap(id);

const roadmap = data?.roadmap;
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