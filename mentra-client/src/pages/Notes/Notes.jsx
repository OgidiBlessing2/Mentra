import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  X,
  Save,
  StickyNote,
} from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { useNotes } from "../../hooks/useNotes";

export default function Notes() {
  const navigate = useNavigate();

  const {
    notes,
    isLoading,
    error,
    addNote,
    editNote,
    removeNote,
    isCreating,
    isUpdating,
    deletingId,
  } = useNotes();

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingNote, setEditingNote] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    );
  });

  function openCreateForm() {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  }

  function openEditForm(note) {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setShowForm(true);
  }

  function closeForm() {
    if (isCreating || isUpdating) return;

    setShowForm(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      if (editingNote) {
        await editNote(editingNote.id, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await addNote({
          title: title.trim(),
          content: content.trim(),
          lessonId: null,
        });
      }

      closeForm();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await removeNote(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  function openLesson(note) {
    if (!note.lessonId) return;

    navigate(`/lessons/${note.lessonId}`);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">

        {/* Header */}

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
                <StickyNote
                  size={24}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white">
                  My Notes
                </h1>

                <p className="mt-1 text-slate-400">
                  Keep track of the things you learn.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
          >
            <Plus size={20} />
            New Note
          </button>

        </div>

        {/* Search */}

        <div className="mt-8">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your notes..."
              className="w-full rounded-2xl border border-white/10 bg-[#18181B] py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
            />

          </div>

        </div>

        {/* Loading */}

        {isLoading && (
          <div className="py-20 text-center text-slate-400">
            Loading your notes...
          </div>
        )}

        {/* Error */}

        {!isLoading && error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            Failed to load your notes.
          </div>
        )}

        {/* Empty */}

        {!isLoading &&
          !error &&
          filteredNotes.length === 0 && (
            <div className="mt-12 rounded-3xl border border-white/10 bg-[#18181B] px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <StickyNote
                  size={30}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                {search
                  ? "No notes found"
                  : "No notes yet"}
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-400">
                {search
                  ? "Try searching for something else."
                  : "Create your first note while learning a lesson."}
              </p>

              {!search && (
                <button
                  onClick={openCreateForm}
                  className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-500"
                >
                  Create Your First Note
                </button>
              )}

            </div>
          )}

        {/* Notes */}

        {!isLoading &&
          !error &&
          filteredNotes.length > 0 && (

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredNotes.map((note) => (

                <div
                  key={note.id}
                  className="group flex min-h-[260px] flex-col rounded-3xl border border-white/10 bg-[#18181B] p-6 transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#1d1d21]"
                >

                  {/* Note header */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <h2 className="truncate text-xl font-bold text-white">
                        {note.title}
                      </h2>

                      <p className="mt-2 text-xs text-slate-500">
                        {note.createdAt
                          ? new Date(
                              note.createdAt
                            ).toLocaleDateString()
                          : "Recently created"}
                      </p>

                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                      <StickyNote
                        size={18}
                        className="text-violet-400"
                      />
                    </div>

                  </div>

                  {/* Content */}

                  <p className="mt-5 line-clamp-5 flex-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {note.content}
                  </p>

                  {/* Lesson */}

                  {note.lessonId && (
                    <button
                      onClick={() => openLesson(note)}
                      className="mt-5 flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                    >
                      <BookOpen size={16} />
                      Open Lesson
                    </button>
                  )}

                  {/* Actions */}

                  <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">

                    <button
                      onClick={() => openEditForm(note)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(note)}
                      className="flex items-center justify-center rounded-xl border border-red-500/20 px-4 py-2.5 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

      </div>

      {/* Create / Edit Modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingNote ? "Edit Note" : "Create Note"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {editingNote
                    ? "Update your note."
                    : "Write down something you want to remember."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={10}
                className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              />

              <button
                type="submit"
                disabled={
                  isCreating ||
                  isUpdating ||
                  !title.trim() ||
                  !content.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating || isUpdating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingNote ? "Save Changes" : "Create Note"}
                  </>
                )}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Delete Confirmation */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#18181B] p-7 shadow-2xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <Trash2
                size={24}
                className="text-red-400"
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Delete this note?
            </h2>

            <p className="mt-2 text-slate-400">
              This will permanently delete{" "}
              <span className="font-semibold text-white">
                "{deleteTarget.title}"
              </span>
              .
            </p>

            <div className="mt-7 flex gap-3">

              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId === deleteTarget.id}
                className="flex-1 rounded-xl border border-white/10 py-3 font-semibold text-white transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deletingId === deleteTarget.id}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deletingId === deleteTarget.id ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}