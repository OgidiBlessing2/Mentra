
import axios from "axios";

// TODO - create the base url endpoint to the dotenv file before shipping to stardance


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

  
  return response.data;
}