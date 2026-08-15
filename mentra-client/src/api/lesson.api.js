import axios from "axios";
// TODO - create the base url endpoint to the dotenv file before shipping to stardance

const API_URL = "http://localhost:5000/api/lessons";

export async function getLesson(id, token) {
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


export async function getCurrentLesson(token) {
  const response = await axios.get(
    `${API_URL}/current`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function completeLesson(id, token) {
  const response = await axios.patch(
    `${API_URL}/${id}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}