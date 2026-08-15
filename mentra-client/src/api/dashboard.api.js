import axios from "axios";
// TODO - create the base url endpoint to the dotenv file before shipping to stardance

const API_URL = "http://localhost:5000/api/dashboard";

export async function getDashboard(token) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}