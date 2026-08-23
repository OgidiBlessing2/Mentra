import { useState } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { useNotes } from "../../hooks/useNotes";

export default function Notes() {
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

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function openCreate() {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  }

  function openEdit(note) {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
  }

  function closeForm() {
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
          title,
          content,
        });
      } else {
        await addNote({
          title,
          content,
        });
      }

      closeForm();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      await removeNote(id);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-black text-white">
              My Notes
            </h1>

            <p className="mt-2 text-slate-400">
              Save important things you learn in Mentra.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-600"
          >
            <Plus size={20} />
            New Note
          </button>

        </div>

        {/* Loading */}

        {isLoading && (
          <div className="mt-12 text-center text-slate-400">
            Loading notes...
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-12 text-center text-red-400">
            Failed to load notes.
          </div>
        )}

        {/* Empty */}

        {!isLoading && !error && notes.length === 0 && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-[#18181B] p-12 text-center">

            <div className="text-5xl">
              📝
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white">
              No notes yet
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first note from something you learned.
            </p>

            <button
              onClick={openCreate}
              className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white"
            >
              Create Note
            </button>

          </div>
        )}

        {/* Notes */}

        {!isLoading && !error && notes.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-3xl border border-white/10 bg-[#18181B] p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <h2 className="text-xl font-bold text-white">
                    {note.title}
                  </h2>

                  <div className="flex gap-2">

                    <button
                      onClick={() => openEdit(note)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
  onClick={() => handleDelete(note.id)}
  disabled={deletingId === note.id}
  className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  {deletingId === note.id ? (
    <span className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
  ) : (
    <Trash2 size={18} />
  )}
</button>
                  </div>

                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                  {note.content}
                </p>

                <p className="mt-6 text-xs text-slate-600">
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleDateString()
                    : ""}
                </p>

              </div>
            ))}

          </div>
        )}

        {/* Create/Edit Modal */}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#18181B] p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold text-white">
                  {editingNote
                    ? "Edit Note"
                    : "Create Note"}
                </h2>

                <button
                  onClick={closeForm}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <X />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Note title"
                  className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-emerald-500"
                />

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="Write your note..."
                  rows={10}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none focus:border-emerald-500"
                />

                <button 
  type="submit" 
  disabled={isCreating || isUpdating}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60" 
> 
  {isCreating || isUpdating ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      {editingNote ? "Saving..." : "Creating..."}
    </>
  ) : (
    <>
      <Save size={18} />

      {editingNote 
        ? "Save Changes" 
        : "Create Note"}
    </>
  )}
</button>
              </form>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}