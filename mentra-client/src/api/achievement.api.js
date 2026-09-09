import axios from "axios";
import { API_URL } from "./config";

export async function getAchievements(token) {
  const response = await axios.get(
    `${API_URL}/achievements`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}