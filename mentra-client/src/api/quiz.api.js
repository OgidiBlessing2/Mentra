import axios from "axios";

// Frontend API base URL.
// Local:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://your-mentra-api.onrender.com/api
const API_URL = `${import.meta.env.VITE_API_URL}/quizzes`;

// -----------------------------------------
// Validate authentication token
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
// Generate Quiz
// -----------------------------------------
export async function generateQuiz(
  lessonId,
  token
) {
  try {
    if (!lessonId) {
      throw new Error(
        "Lesson ID is required to generate a quiz."
      );
    }

    validateToken(token);

    console.log(
      "🧠 Generating quiz for lesson:",
      lessonId
    );

    const response = await axios.post(
      `${API_URL}/generate/${lessonId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ Quiz generated successfully."
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Quiz generation request failed."
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
          "🔐 Clerk authentication failed while generating quiz."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}

// -----------------------------------------
// Submit Quiz
// -----------------------------------------
export async function submitQuiz(
  quizId,
  answers,
  token
) {
  try {
    if (!quizId) {
      throw new Error(
        "Quiz ID is required to submit the quiz."
      );
    }

    if (!Array.isArray(answers)) {
      throw new Error(
        "Quiz answers must be an array."
      );
    }

    validateToken(token);

    console.log(
      "📝 Submitting quiz:",
      quizId
    );

    const response = await axios.post(
      `${API_URL}/submit/${quizId}`,
      {
        answers,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ Quiz submitted successfully."
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Quiz submission request failed."
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
          "🔐 Clerk authentication failed while submitting quiz."
        );
      }
    } else {
      console.error(error);
    }

    throw error;
  }
}