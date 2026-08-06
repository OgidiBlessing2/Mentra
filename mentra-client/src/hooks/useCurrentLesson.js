import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { getCurrentLesson } from "../api/lesson.api";

export function useCurrentLesson() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["currentLesson"],

    queryFn: async () => {
      const token = await getToken();
      return getCurrentLesson(token);
    },
  });
}