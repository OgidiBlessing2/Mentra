
import { useQuery } from "@tanstack/react-query";

import { getCurrentLesson } from "../api/lesson.api";

export function useCurrentLesson() {
  return useQuery({
    queryKey: ["currentLesson"],

    queryFn: async () => {
      return getCurrentLesson();
    },
  });
}
