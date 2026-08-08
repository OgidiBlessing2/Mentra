
import axios from "axios";

const API_URL =
  "http://localhost:5000/api/quizzes";

export async function generateQuiz(
  lessonId,
  token
) {
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
export async function submitQuiz(quizId, answers, token) {
  console.log("🚀 SUBMIT API CALLED");
  console.log("Quiz ID:", quizId);
  console.log("Answers:", answers);
  console.log("Token exists:", !!token);

  const url =
    `http://localhost:5000/api/quizzes/submit/${quizId}`;

  console.log("🌐 URL:", url);

  try {
    const response = await axios.post(
      url,
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
  } catch (error) {
    console.error("❌ SUBMIT REQUEST FAILED");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Error:", error);

    throw error;
  }
}