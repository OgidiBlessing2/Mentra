
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import {
  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
} from "../api/projectTasks.api.js";

export const useProjectTasks = (projectId) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => {
      const token = await getToken();
      return getProjectTasks(projectId, token);
    },
    enabled: !!projectId,
  });

 const createTask = useMutation({
  mutationFn: async (data) => {
    const token = await getToken();
    return createProjectTask(projectId, data, token);
  },

  onSuccess: (data) => {
    console.log("✅ CREATE SUCCESS:", data);

    // Immediately add the new task to the UI
    queryClient.setQueryData(
      ["projectTasks", projectId],
      (oldData) => {
        if (!oldData) {
          return {
            success: true,
            tasks: [data.task],
          };
        }

        return {
          ...oldData,
          tasks: [...(oldData.tasks || []), data.task],
        };
      }
    );

    // Also refetch from the database to stay synchronized
    queryClient.invalidateQueries({
      queryKey: ["projectTasks", projectId],
    });
  },

  onError: (error) => {
    console.error(
      "❌ CREATE TASK ERROR:",
      error?.response?.data || error
    );
  },
});

  const updateTask = useMutation({
    mutationFn: async ({ taskId, data }) => {
      const token = await getToken();
      return updateProjectTask(
        projectId,
        taskId,
        data,
        token
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", projectId],
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId) => {
      const token = await getToken();

      return deleteProjectTask(
        projectId,
        taskId,
        token
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", projectId],
      });
    },
  });

  return {
    tasks: tasksQuery.data?.tasks || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,

    createTask,
    updateTask,
    deleteTask,
  };
};
