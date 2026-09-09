import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { chatWithMentor } from "../api/mentor.api";

export function useMentor() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      lessonId,
      question,
    }) => {

      const token = await getToken();

      return chatWithMentor(
        lessonId,
        question,
        token
      );

    },
  });
}