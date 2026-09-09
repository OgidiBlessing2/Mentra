import api from "./axios.js";

//  🔖 Get all bookmarks
export async function getBookmarks(token) {
  const response = await api.get("/bookmarks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// ➕ Create bookmark
export async function createBookmark(token, lessonId) {
  const response = await api.post(
    "/bookmarks",
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
export async function deleteBookmark(token, lessonId) {
  const response = await api.delete(
    `/bookmarks/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}