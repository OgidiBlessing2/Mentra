import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { getAchievements } from "../api/achievement.api";

export function useAchievements() {
  const { getToken } = useAuth();

  const [achievements, setAchievements] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    async function loadAchievements() {
      try {
        setIsLoading(true);

        const token = await getToken();

        const data =
          await getAchievements(token);

        setAchievements(
          data.achievements ?? []
        );
      } catch (error) {
        console.error(
          "Failed to load achievements:",
          error
        );

        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAchievements();
  }, [getToken]);

  return {
    achievements,
    isLoading,
    error,
  };
}