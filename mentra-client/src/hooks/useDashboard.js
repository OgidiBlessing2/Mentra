import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getDashboard } from "../api/dashboard.api";

export function useDashboard() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const token = await getToken();

      const data = await getDashboard(token);


      return data;
    },

    staleTime: 0,
    refetchOnMount: true,
  });
}