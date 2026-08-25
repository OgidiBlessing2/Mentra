import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../api/flashcard.api";

export function useFlashcards() {
  const { getToken } = useAuth();

  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  // 📚 Load flashcards
  const loadFlashcards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();

      const data =
        await getFlashcards(token);

      setFlashcards(
        data.flashcards ?? []
      );

    } catch (err) {
      console.error(
        "❌ Failed to load flashcards:",
        err
      );

      setError(err);

    } finally {
      setIsLoading(false);
    }
  }, [getToken]);


  // 🧠 Create flashcard
  const addFlashcard = async (data) => {
    try {
      setIsCreating(true);

      const token = await getToken();

      const response =
        await createFlashcard(
          token,
          data
        );

      setFlashcards((prev) => [
        response.flashcard,
        ...prev,
      ]);

      return response.flashcard;

    } finally {
      setIsCreating(false);
    }
  };


  // ✏️ Update flashcard
  const editFlashcard = async (
    id,
    data
  ) => {
    try {
      setIsUpdating(true);

      const token = await getToken();

      const response =
        await updateFlashcard(
          token,
          id,
          data
        );

      setFlashcards((prev) =>
        prev.map((flashcard) =>
          flashcard.id === id
            ? response.flashcard
            : flashcard
        )
      );

      return response.flashcard;

    } finally {
      setIsUpdating(false);
    }
  };


  // 🗑️ Delete flashcard
  const removeFlashcard = async (id) => {
    try {
      setDeletingId(id);

      const token = await getToken();

      await deleteFlashcard(
        token,
        id
      );

      setFlashcards((prev) =>
        prev.filter(
          (flashcard) =>
            flashcard.id !== id
        )
      );

    } finally {
      setDeletingId(null);
    }
  };


  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);


  return {
    flashcards,
    isLoading,
    error,

    loadFlashcards,

    addFlashcard,
    editFlashcard,
    removeFlashcard,

    isCreating,
    isUpdating,
    deletingId,
  };
}