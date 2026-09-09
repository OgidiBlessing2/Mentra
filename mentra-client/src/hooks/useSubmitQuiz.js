
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { submitQuiz } from "../api/quiz.api";

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ quizId, answers }) => {
      const token = await getToken();

      console.log("🔐 Submit quiz token exists:", !!token);

      if (!token) {
        throw new Error("No authentication token");
      }

      return submitQuiz(quizId, answers, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      console.log("✅ Quiz submitted — dashboard refreshed");
    },
  });
}
