import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import {
  getBookmarks,
  createBookmark,
  deleteBookmark,
} from "../api/bookmark.api";

export function useBookmarks() {
  const { getToken } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // 📚 Load bookmarks
  const loadBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();

      const data = await getBookmarks(token);

      setBookmarks(data.bookmarks ?? []);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // 🔖 Add bookmark
  const addBookmark = async (lessonId) => {
    try {
      setIsAdding(true);

      const token = await getToken();

      const response = await createBookmark(
        token,
        lessonId
      );

      setBookmarks((prev) => {
        const exists = prev.some(
          (bookmark) =>
            bookmark.lessonId === lessonId
        );

        if (exists) {
          return prev;
        }

        return [response.bookmark, ...prev];
      });

      return response.bookmark;
    } finally {
      setIsAdding(false);
    }
  };

  // ❌ Remove bookmark
  const removeBookmark = async (lessonId) => {
    try {
      setDeletingId(lessonId);

      const token = await getToken();

      await deleteBookmark(
        token,
        lessonId
      );

      setBookmarks((prev) =>
        prev.filter(
          (bookmark) =>
            bookmark.lessonId !== lessonId
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Load when hook starts
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    isAdding,
    deletingId,
    loadBookmarks,
    addBookmark,
    removeBookmark,
  };
}