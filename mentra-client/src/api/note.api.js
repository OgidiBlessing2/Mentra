import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

// Get all notes
export async function getNotes(token) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Get one note
export async function getNote(token, id) {
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

// Create note
export async function createNote(token, data) {
  const response = await axios.post(
    API_URL,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// Update note
export async function updateNote(
  token,
  id,
  data
) {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// Delete note
export async function deleteNote(
  token,
  id
) {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}