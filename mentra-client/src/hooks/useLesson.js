
import { useQuery } from "@tanstack/react-query";
import { getLesson } from "../api/lesson.api";

export function useLesson(id) {
  return useQuery({
    queryKey: ["lesson", id],

    enabled: !!id,

    queryFn: async () => {
      return getLesson(id);
    },
  });
}
