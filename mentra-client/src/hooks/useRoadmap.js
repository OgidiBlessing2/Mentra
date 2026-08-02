import { useEffect, useState } from "react";
import api from "../lib/api";

export function useRoadmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const roadmapId = localStorage.getItem("roadmapId");

        if (!roadmapId) {
          throw new Error("No roadmap found.");
        }

        const res = await api.get(`/roadmaps/${roadmapId}`);

        setData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, []);

  return {
    data,
    loading,
    error,
  };
}