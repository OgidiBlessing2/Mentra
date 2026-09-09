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

    onSuccess: (response) => {
      toast.success("Roadmap generated!");

      // Store roadmap instantly
      queryClient.setQueryData(
        ["roadmap", response.roadmap.id],
        response
      );

      // Force dashboard to refresh
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}