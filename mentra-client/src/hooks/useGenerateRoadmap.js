import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import { generateRoadmap } from "../api/roadmap.api";

export function useGenerateRoadmap() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (formData) => {
      const token = await getToken();

      return generateRoadmap(formData, token);
    },

    onSuccess: () => {
      toast.success("Roadmap generated!");

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["roadmap"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });
}