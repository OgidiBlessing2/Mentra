import axios from "axios";

const API_URL = "http://localhost:5000/api/quizzes";

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