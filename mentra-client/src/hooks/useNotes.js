import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/note.api";

export function useNotes() {
  const { getToken } = useAuth();

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
const [isUpdating, setIsUpdating] = useState(false);
const [deletingId, setDeletingId] = useState(null);

  // Get all notes
  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();

      const data = await getNotes(token);

      setNotes(data.notes ?? []);
    } catch (err) {
      console.error("Failed to load notes:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // Create note
  const addNote = async (data) => {
  try {
    setIsCreating(true);

    const token = await getToken();
    const response = await createNote(token, data);

    setNotes((prev) => [response.note, ...prev]);

    return response.note;
  } finally {
    setIsCreating(false);
  }
};
  // Update note
 const editNote = async (id, data) => {
  try {
    setIsUpdating(true);

    const token = await getToken();

    const response = await updateNote(
      token,
      id,
      data
    );

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? response.note
          : note
      )
    );

    return response.note;
  } finally {
    setIsUpdating(false);
  }
};

  // Delete note
  const removeNote = async (id) => {
  try {
    setDeletingId(id);

    const token = await getToken();

    await deleteNote(token, id);

    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );
  } finally {
    setDeletingId(null);
  }
};

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

 return {
  notes,
  isLoading,
  error,
  loadNotes,
  addNote,
  editNote,
  removeNote,

  isCreating,
  isUpdating,
  deletingId,
};
}