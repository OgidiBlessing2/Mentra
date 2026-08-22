import axios from "axios";

export async function getAchievements(token) {
  const response = await axios.get(
    "http://localhost:5000/api/achievements",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}