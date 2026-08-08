
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { submitQuiz } from "../api/quiz.api";

export function useSubmitQuiz() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      quizId,
      answers,
    }) => {
      const token = await getToken();

      return submitQuiz(
        quizId,
        answers,
        token
      );
    },
  });
}