import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getRoadmap } from "../api/roadmap.api";

export function useRoadmap(id) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["roadmap", id],

    enabled: !!id,

    queryFn: async () => {
      const token = await getToken();

      return getRoadmap(id, token);
    },
  });
}