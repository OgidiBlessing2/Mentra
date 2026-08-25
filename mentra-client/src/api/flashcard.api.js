import axios from "axios";

const API_URL = "http://localhost:5000/api/flashcards";


// 🧠 Create flashcard
export async function createFlashcard(token, data) {
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


// 📚 Get flashcards
export async function getFlashcards(token) {
  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


// ✏️ Update flashcard
export async function updateFlashcard(
  token,
  id,
  data
) {
  const response = await axios.put(
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


// 🗑️ Delete flashcard
export async function deleteFlashcard(
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