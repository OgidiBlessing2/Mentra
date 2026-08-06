import axios from "axios";

const API_URL = "http://localhost:5000/api/mentor";

export async function chatWithMentor(
  lessonId,
  question,
  token
) {
  const response = await axios.post(
    `${API_URL}/chat`,
    {
      lessonId,
      question,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}