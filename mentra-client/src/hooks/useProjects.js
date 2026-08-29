import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@clerk/clerk-react";

import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../api/project.api";


// -----------------------------------------
// Get Projects
// -----------------------------------------

export function useProjects() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects"],

    queryFn: async () => {
      const token = await getToken();

      return getProjects(token);
    },
  });


  // ---------------------------------------
  // Create Project
  // ---------------------------------------

  const createMutation = useMutation({
    mutationFn: async (project) => {
      const token = await getToken();

      return createProject(
        token,
        project
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });


  // ---------------------------------------
  // Update Project
  // ---------------------------------------

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      project,
    }) => {
      const token = await getToken();

      return updateProject(
        token,
        id,
        project
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });


  // ---------------------------------------
  // Delete Project
  // ---------------------------------------

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();

      return deleteProject(
        token,
        id
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });


  return {
    projects:
      projectsQuery.data?.projects ?? [],

    isLoading:
      projectsQuery.isLoading,

    error:
      projectsQuery.error,

    refetch:
      projectsQuery.refetch,

    addProject:
      createMutation.mutateAsync,

    updateProject:
      updateMutation.mutateAsync,

    removeProject:
      deleteMutation.mutateAsync,

    isCreating:
      createMutation.isPending,

    isUpdating:
      updateMutation.isPending,

    isDeleting:
      deleteMutation.isPending,

    createError:
      createMutation.error,

    updateError:
      updateMutation.error,

    deleteError:
      deleteMutation.error,
  };
}


// -----------------------------------------
// Get Single Project
// -----------------------------------------

export function useProject(id) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["project", id],

    enabled: !!id,

    queryFn: async () => {
      const token = await getToken();

      return getProject(
        token,
        id
      );
    },
  });
}