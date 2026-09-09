import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getLesson } from "../api/lesson.api";

export function useLesson(id) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["lesson", id],
    enabled: !!id,

    queryFn: async () => {
      const token = await getToken();
      return getLesson(id, token);
    },
  });
}