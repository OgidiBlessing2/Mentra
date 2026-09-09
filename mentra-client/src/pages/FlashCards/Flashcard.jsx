import { useState } from "react";
import { useFlashcards } from "../../hooks/useFlashcards";
import DashboardLayout from "../../layout/DashboardLayout";

export default function Flashcards() {
  const {
    flashcards,
    isLoading,
    error,
    addFlashcard,
    isCreating,
  } = useFlashcards();

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isFlipped, setIsFlipped] =
    useState(false);

  const [learned, setLearned] =
    useState([]);

  // Create modal
  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [lessonId, setLessonId] =
    useState("");

  async function handleCreateFlashcard(e) {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      return;
    }

    try {
      await addFlashcard({
        lessonId: lessonId.trim()
          ? lessonId.trim()
          : null,
        question: question.trim(),
        answer: answer.trim(),
      });

      setQuestion("");
      setAnswer("");
      setLessonId("");
      setShowCreateForm(false);

      // Show the newly-created card
      setCurrentIndex(0);
      setIsFlipped(false);

    } catch (error) {
      console.error(
        "❌ Failed to create flashcard:",
        error
      );
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-slate-400">
            Loading flashcards...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-red-400">
            Failed to load flashcards.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const hasFlashcards =
    flashcards.length > 0;

  const currentCard =
    hasFlashcards
      ? flashcards[currentIndex]
      : null;

  function nextCard() {
    if (!hasFlashcards) return;

    setIsFlipped(false);

    setCurrentIndex((prev) =>
      prev === flashcards.length - 1
        ? 0
        : prev + 1
    );
  }

  function previousCard() {
    if (!hasFlashcards) return;

    setIsFlipped(false);

    setCurrentIndex((prev) =>
      prev === 0
        ? flashcards.length - 1
        : prev - 1
    );
  }

  function markLearned() {
    if (!currentCard) return;

    if (!learned.includes(currentCard.id)) {
      setLearned((prev) => [
        ...prev,
        currentCard.id,
      ]);
    }

    nextCard();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl px-6">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400">
              🧠 Study Mode
            </span>

            <h1 className="mt-5 text-4xl font-black text-white">
              Flashcards
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              Test yourself and strengthen what
              you've learned.
            </p>
          </div>

          {/* Create button */}

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(true)
            }
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-4 font-bold text-white transition hover:scale-[1.02]"
          >
            + Create Flashcard
          </button>

        </div>


        {/* Empty state */}

        {!hasFlashcards ? (
          <div className="flex min-h-[55vh] items-center justify-center">

            <div className="w-full rounded-3xl border border-white/10 bg-[#18181B] p-10 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10 text-4xl">
                🧠
              </div>

              <h2 className="mt-6 text-3xl font-black text-white">
                No Flashcards Yet
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-slate-400">
                Create your first flashcard and
                start strengthening your memory.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(true)
                }
                className="mt-7 rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-white transition hover:bg-emerald-600"
              >
                Create Your First Flashcard
              </button>

            </div>

          </div>
        ) : (
          <>
            {/* Progress */}

            <div className="mb-6">

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Card {currentIndex + 1} of{" "}
                  {flashcards.length}
                </span>

                <span className="text-sm text-emerald-400">
                  {learned.length} learned
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#27272A]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                  style={{
                    width: `${
                      ((currentIndex + 1) /
                        flashcards.length) *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>


            {/* Flashcard */}

            <button
              type="button"
              onClick={() =>
                setIsFlipped(
                  (prev) => !prev
                )
              }
              className="group w-full text-left"
            >

              <div className="relative min-h-[420px] [perspective:1200px]">

                <div
                  className={`absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFlipped
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >

                  {/* Question */}

                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#18181B] p-10 text-center shadow-2xl [backface-visibility:hidden]">

                    <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
                      Question
                    </span>

                    <h2 className="mt-8 max-w-3xl text-3xl font-bold leading-relaxed text-white">
                      {currentCard.question}
                    </h2>

                    <p className="absolute bottom-8 text-sm text-slate-500">
                      Click to reveal answer
                    </p>

                  </div>


                  {/* Answer */}

                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-emerald-500/20 bg-[#18181B] p-10 text-center shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">

                    <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                      Answer
                    </span>

                    <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-200">
                      {currentCard.answer}
                    </p>

                    <p className="absolute bottom-8 text-sm text-slate-500">
                      Click to see question
                    </p>

                  </div>

                </div>

              </div>

            </button>


            {/* Controls */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <button
                type="button"
                onClick={previousCard}
                className="flex-1 rounded-2xl border border-white/10 py-4 font-bold text-white transition hover:bg-white/5"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsFlipped(
                    (prev) => !prev
                  )
                }
                className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 py-4 font-bold text-white transition hover:scale-[1.02]"
              >
                {isFlipped
                  ? "Show Question"
                  : "Reveal Answer"}
              </button>

              <button
                type="button"
                onClick={nextCard}
                className="flex-1 rounded-2xl border border-white/10 py-4 font-bold text-white transition hover:bg-white/5"
              >
                Next →
              </button>

            </div>


            {/* Learning actions */}

            {isFlipped && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={nextCard}
                  className="rounded-2xl border border-red-400/20 bg-red-400/5 py-4 font-bold text-red-400 transition hover:bg-red-400/10"
                >
                  🔄 Still Learning
                </button>

                <button
                  type="button"
                  onClick={markLearned}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 py-4 font-bold text-emerald-400 transition hover:bg-emerald-400/10"
                >
                  ✓ I Know This
                </button>

              </div>
            )}
          </>
        )}


        {/* CREATE FLASHCARD MODAL */}

        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Create Flashcard
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Add a question and answer to
                    your study deck.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateForm(false)
                  }
                  className="rounded-lg p-2 text-2xl text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  ×
                </button>

              </div>


              {/* Form */}

              <form
                onSubmit={
                  handleCreateFlashcard
                }
                className="mt-6 space-y-5"
              >

                {/* Question */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Question
                  </label>

                  <textarea
                    value={question}
                    onChange={(e) =>
                      setQuestion(
                        e.target.value
                      )
                    }
                    placeholder="e.g. What is the capital of Nigeria?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                  />

                </div>


                {/* Answer */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Answer
                  </label>

                  <textarea
                    value={answer}
                    onChange={(e) =>
                      setAnswer(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Abuja"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
                  />

                </div>


                {/* Optional lesson ID */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Lesson ID{" "}
                    <span className="text-slate-500">
                      (optional)
                    </span>
                  </label>

                  <input
                    value={lessonId}
                    onChange={(e) =>
                      setLessonId(
                        e.target.value
                      )
                    }
                    placeholder="Leave empty for a general flashcard"
                    className="w-full rounded-xl border border-white/10 bg-[#232326] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                  />

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    !question.trim() ||
                    !answer.trim()
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-4 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {isCreating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    "Create Flashcard"
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