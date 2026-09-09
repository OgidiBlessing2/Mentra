
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

  onMutate: async ({ taskId, data }) => {
    await queryClient.cancelQueries({
      queryKey: ["projectTasks", projectId],
    });

    const previousData = queryClient.getQueryData([
      "projectTasks",
      projectId,
    ]);

    queryClient.setQueryData(
      ["projectTasks", projectId],
      (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          tasks: (oldData.tasks || []).map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...data,
                }
              : task
          ),
        };
      }
    );

    return { previousData };
  },

  onError: (error, variables, context) => {
    console.error(
      "❌ UPDATE TASK ERROR:",
      error?.response?.data || error
    );

    if (context?.previousData) {
      queryClient.setQueryData(
        ["projectTasks", projectId],
        context.previousData
      );
    }
  },

  onSuccess: (data) => {
    console.log("✅ UPDATE SUCCESS:", data);

    queryClient.setQueryData(
      ["projectTasks", projectId],
      (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          tasks: (oldData.tasks || []).map((task) =>
            task.id === data.task.id
              ? data.task
              : task
          ),
        };
      }
    );
  },

  onSettled: () => {
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
