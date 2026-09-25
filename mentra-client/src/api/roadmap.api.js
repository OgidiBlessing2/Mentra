import api from "./axios";

/*
 * Generate a new roadmap
 */
export async function generateRoadmap(data) {
  try {
    console.log("🗺️ Generating roadmap...");

    const response = await api.post(
      "/roadmaps/generate",
      data
    );

    console.log("✅ Roadmap generated successfully");

    return response.data;
  } catch (error) {
    console.error("❌ Roadmap generation failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Server response:", error.response.data);

      if (error.response.status === 401) {
        console.error(
          "🔐 Clerk authentication failed while generating roadmap."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}

/*
 * Get a specific roadmap
 */
export async function getRoadmap(id) {
  if (!id) {
    throw new Error("Roadmap ID is required.");
  }

  try {
    console.log("🗺️ Getting roadmap:", id);

    const response = await api.get(
      `/roadmaps/${id}`
    );

    console.log("✅ Roadmap retrieved successfully");

    return response.data;
  } catch (error) {
    console.error("❌ Get roadmap request failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Server response:", error.response.data);

      if (error.response.status === 401) {
        console.error(
          "🔐 Clerk authentication failed while getting roadmap."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}

/*
 * Search roadmaps
 */
export async function searchRoadmaps(query) {
  try {
    console.log("🔎 Searching roadmaps:", query);

    const response = await api.get(
      "/roadmaps/search",
      {
        params: {
          q: query,
        },
      }
    );

    console.log("✅ Roadmap search completed");

    return response.data;
  } catch (error) {
    console.error("❌ Roadmap search failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Server response:", error.response.data);

      if (error.response.status === 401) {
        console.error(
          "🔐 Clerk authentication failed while searching roadmaps."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}