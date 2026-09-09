import axios from "axios";

const API_URL = "http://localhost:5000/api/bookmarks";

// 🔖 Get all bookmarks
export async function getBookmarks(token) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// ➕ Create bookmark
export async function createBookmark(
  token,
  lessonId
) {
  const response = await axios.post(
    API_URL,
    { lessonId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// ❌ Delete bookmark
export async function deleteBookmark(
  token,
  lessonId
) {
  const response = await axios.delete(
    `${API_URL}/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}