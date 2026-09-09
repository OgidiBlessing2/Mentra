import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { generateQuiz } from "../api/quiz.api";

export function useGenerateQuiz() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (lessonId) => {
      const token = await getToken();

      console.log("Quiz token:", token);

      if (!token) {
        throw new Error("No Clerk token found");
      }

      return generateQuiz(lessonId, token);
    },
  });
}