
import api from "./axios";

// -----------------------------------------
// Get Lesson
// -----------------------------------------
export async function getLesson(id) {
  if (!id) {
    throw new Error("Lesson ID is required.");
  }

  try {
    console.log("📚 Getting lesson:", id);

    const response = await api.get(`/lessons/${id}`);

    console.log("✅ Lesson retrieved successfully.");

    return response.data;
  } catch (error) {
    console.error("❌ Get lesson request failed.");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Server response:", error.response.data);

      if (error.response.status === 401) {
        console.error(
          "🔐 Clerk authentication failed while getting lesson."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}

// -----------------------------------------
// Get Current Lesson
// -----------------------------------------
export async function getCurrentLesson() {
  try {
    console.log("📖 Getting current lesson...");

    const response = await api.get("/lessons/current");

    console.log(
      "✅ Current lesson retrieved successfully."
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Get current lesson request failed."
    );

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Server response:", error.response.data);

      if (error.response.status === 401) {
        console.error(
          "🔐 Clerk authentication failed while getting current lesson."
        );
      }

      if (error.response.status === 500) {
        console.error(
          "🔥 Backend returned 500 while getting current lesson."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}

// -----------------------------------------
// Complete Lesson
// -----------------------------------------
export async function completeLesson(id) {
  if (!id) {
    throw new Error("Lesson ID is required.");
  }

  try {
    console.log("✅ Completing lesson:", id);

    const response = await api.patch(
      `/lessons/${id}/complete`,
      {}
    );

    console.log(
      "🎉 Lesson completed successfully."
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Complete lesson request failed."
    );

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Server response:", error.response.data);

      if (error.response.status === 401) {
        console.error(
          "🔐 Clerk authentication failed while completing lesson."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}