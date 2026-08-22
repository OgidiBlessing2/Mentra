import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { completeLesson } from "../api/lesson.api";

export function useCompleteLesson() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (lessonId) => {
      const token = await getToken();

      console.log("🔐 Complete lesson token:", !!token);

      const response = await completeLesson(
        lessonId,
        token
      );

      return response;
    },
  });
}