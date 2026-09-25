
import { useMutation } from "@tanstack/react-query";

import { completeLesson } from "../api/lesson.api";

export function useCompleteLesson() {
  return useMutation({
    mutationFn: async (lessonId) => {
      return completeLesson(lessonId);
    },
  });
}
