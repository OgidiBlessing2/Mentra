import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { generateQuiz } from "../api/quiz.api";

export function useGenerateQuiz() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (lessonId) => {
      const token = await getToken();

      return generateQuiz(lessonId, token);
    },
  });
}