import { useQuery } from "@tanstack/react-query";
import { getRoadmap } from "../api/roadmap.api";

export function useRoadmap(id) {
  return useQuery({
    queryKey: ["roadmap", id],

    enabled: !!id,

    queryFn: async () => {
      console.log("🗺️ ROADMAP: Loading roadmap:", id);

      const data = await getRoadmap(id);

      console.log("✅ ROADMAP: Roadmap loaded");

      return data;
    },
  });
}