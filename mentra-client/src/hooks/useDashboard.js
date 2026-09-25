
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getDashboard } from "../api/dashboard.api";

export function useDashboard() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      console.log("📊 DASHBOARD: Loading dashboard...");

      const data = await getDashboard();

      console.log("✅ DASHBOARD: Data received");

      return data;
    },

    /*
     * Don't make the request until Clerk has completely
     * restored the authentication state and the user
     * is signed in.
     */
    enabled: isLoaded && isSignedIn,

    staleTime: 0,
    refetchOnMount: true,
  });
}
