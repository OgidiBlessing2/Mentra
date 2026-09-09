import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { useBookmarks } from "../../hooks/useBookmarks";

export default function Bookmarks() {
  const navigate = useNavigate();

  const {
    bookmarks,
    isLoading,
    error,
    removeBookmark,
    deletingId,
  } = useBookmarks();

  function handleOpenLesson(lessonId) {
    navigate(`/lessons/${lessonId}`);
  }

  async function handleDelete(lessonId) {
    try {
      await removeBookmark(lessonId);
    } catch (error) {
      console.error(
        "Failed to remove bookmark:",
        error
      );
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">

        {/* Header */}

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10">
              <Bookmark
                className="text-amber-400"
                size={24}
                fill="currentColor"
              />
            </div>

            <div>
              <h1 className="text-4xl font-black text-white">
                Bookmarks
              </h1>

              <p className="mt-2 text-slate-400">
                Quickly return to lessons you want to revisit.
              </p>
            </div>

          </div>
        </div>

        {/* Loading */}

        {isLoading && (
          <div className="mt-12 text-center text-slate-400">
            Loading bookmarks...
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-12 text-center text-red-400">
            Failed to load bookmarks.
          </div>
        )}

        {/* Empty */}

        {!isLoading &&
          !error &&
          bookmarks.length === 0 && (
            <div className="mt-12 rounded-3xl border border-white/10 bg-[#18181B] p-12 text-center">

              <Bookmark
                size={48}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-2xl font-bold text-white">
                No bookmarks yet
              </h2>

              <p className="mt-2 text-slate-400">
                Bookmark lessons while learning to find them here later.
              </p>

              <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600"
              >
                Continue Learning
              </button>

            </div>
          )}

        {/* Bookmarks */}

        {!isLoading &&
          !error &&
          bookmarks.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="rounded-3xl border border-white/10 bg-[#18181B] p-6 transition hover:border-amber-400/30"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                        <Bookmark
                          size={18}
                          className="text-amber-400"
                          fill="currentColor"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          Saved Lesson
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Lesson
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        handleDelete(bookmark.lessonId)
                      }
                      disabled={
                        deletingId === bookmark.lessonId
                      }
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === bookmark.lessonId ? (
                        <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>

                  </div>

                 <h2 className="mt-6 text-xl font-bold text-white">
  {bookmark.title}
</h2>

<p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
  {bookmark.description || "No description available."}
</p>
                  <button
                    onClick={() =>
                      handleOpenLesson(bookmark.lessonId)
                    }
                    className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-600"
                  >
                    Open Lesson →
                  </button>

                </div>
              ))}

            </div>
          )}

      </div>
    </DashboardLayout>
  );
}