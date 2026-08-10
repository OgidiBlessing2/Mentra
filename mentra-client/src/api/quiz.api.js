
import axios from "axios";

const API_URL = "http://localhost:5000/api/quizzes";

// -----------------------------------------
// Generate Quiz
// -----------------------------------------
export async function generateQuiz(lessonId, token) {
  const response = await axios.post(
    `${API_URL}/generate/${lessonId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// -----------------------------------------
// Submit Quiz
// -----------------------------------------
export async function submitQuiz(quizId, answers, token) {
  console.log("🚀 SUBMIT API CALLED");
  console.log("Quiz ID:", quizId);
  console.log("Answers:", answers);
  console.log("Token exists:", !!token);

  const response = await axios.post(
    `${API_URL}/submit/${quizId}`,
    { answers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(
    "✅ SUBMIT RESPONSE:",
    JSON.stringify(response.data, null, 2)
  );

  return response.data;
}