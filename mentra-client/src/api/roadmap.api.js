import axios from "axios";

// TODO - create the base url endpoint to the dotenv file before shipping to stardance
// TODO - create the base url endpoint to the dotenv file before shipping to stardance

const API_URL = "http://localhost:5000/api/roadmaps";

export async function generateRoadmap(data, token) {
  const response = await axios.post(
    `${API_URL}/generate`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getRoadmap(id, token) {
  const response = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function searchRoadmaps(token, query) {
  const response = await axios.get(
    `${API_URL}/search`,
    {
      params: {
        q: query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}