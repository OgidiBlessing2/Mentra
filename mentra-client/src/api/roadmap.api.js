import axios from "axios";

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