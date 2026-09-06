
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getDashboard } from "../api/dashboard.api";

export function useDashboard() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      console.log("🔐 DASHBOARD: Getting Clerk token...");

      const token = await getToken();

      console.log(
        "🔐 DASHBOARD: Token received:",
        !!token
      );

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      const data = await getDashboard(token);

      console.log("✅ DASHBOARD: Data received");

      return data;
    },

    // Don't run the query until Clerk has finished loading
    // and we know the user is signed in.
    enabled: isLoaded && isSignedIn,

    staleTime: 0,
    refetchOnMount: true,
  });
}
