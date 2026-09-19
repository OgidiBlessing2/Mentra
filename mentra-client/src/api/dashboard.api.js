import axios from "axios";

// API base URL should be provided through the frontend environment.
// Local development:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://your-mentra-api.onrender.com/api

const API_URL = `${import.meta.env.VITE_API_URL}/dashboard`;

export async function getDashboard(token) {
  if (!token) {
    throw new Error(
      "Authentication token is required to load the dashboard."
    );
  }

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}