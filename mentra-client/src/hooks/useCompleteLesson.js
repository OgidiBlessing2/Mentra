import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { completeLesson } from "../api/lesson.api";

export function useCompleteLesson() {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId) => {
      const token = await getToken();

      return completeLesson(lessonId, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["currentLesson"],
      });

      queryClient.invalidateQueries({
        queryKey: ["lesson"],
      });
    },
  });
}