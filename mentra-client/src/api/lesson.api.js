import axios from "axios";

// Frontend API base URL.
//
// Local:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://your-mentra-api.onrender.com/api
const API_URL = `${import.meta.env.VITE_API_URL}/lessons`;

// -----------------------------------------
// Validate Authentication Token
// -----------------------------------------
function validateToken(token) {
  if (!token) {
    throw new Error(
      "Authentication token is missing."
    );
  }

  if (typeof token !== "string") {
    throw new Error(
      "Authentication token is invalid."
    );
  }
}

// -----------------------------------------
// Get Lesson
// -----------------------------------------
export async function getLesson(id, token) {
  try {
    if (!id) {
      throw new Error(
        "Lesson ID is required."
      );
    }

    validateToken(token);

    console.log(
      "📚 Getting lesson:",
      id
    );

    const response = await axios.get(
      `${API_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ Lesson retrieved successfully."
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Get lesson request failed."
    );

    if (error.response) {
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Server response:",
        error.response.data
      );

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
export async function getCurrentLesson(token) {
  try {
    validateToken(token);

    console.log(
      "📖 Getting current lesson..."
    );

    const response = await axios.get(
      `${API_URL}/current`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ Current lesson retrieved successfully."
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Get current lesson request failed."
    );

    if (error.response) {
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Server response:",
        error.response.data
      );

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
export async function completeLesson(
  id,
  token
) {
  try {
    if (!id) {
      throw new Error(
        "Lesson ID is required."
      );
    }

    validateToken(token);

    console.log(
      "✅ Completing lesson:",
      id
    );

    const response = await axios.patch(
      `${API_URL}/${id}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
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
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Server response:",
        error.response.data
      );

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