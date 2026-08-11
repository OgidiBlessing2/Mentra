import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";

import { useGenerateQuiz } from "../../hooks/useGenerateQuiz";
import { useSubmitQuiz } from "../../hooks/useSubmitQuiz";

export default function Quiz() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const quizMutation = useGenerateQuiz();
  const submitMutation = useSubmitQuiz();

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // -----------------------------------------
  // Generate quiz
  // -----------------------------------------

  useEffect(() => {
    if (!lessonId) return;

    quizMutation.mutate(lessonId);
  }, [lessonId]);

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (quizMutation.isPending) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg text-slate-400">
            Generating your quiz...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (quizMutation.isError) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              Failed to load quiz
            </h1>

            <p className="mt-3 text-slate-400">
              {quizMutation.error?.message ||
                "Something went wrong."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const quiz = quizMutation.data?.quiz;

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-400">
            No quiz found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const questions = quiz.questions ?? [];

  // -----------------------------------------
  // Select answer
  // -----------------------------------------

  function handleAnswer(questionId, answer) {
    if (result) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  // -----------------------------------------
  // Submit quiz
  // -----------------------------------------

  function handleSubmit() {
    if (Object.keys(answers).length !== questions.length) {
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      })
    );

    submitMutation.mutate(
      {
        quizId: quiz.id,
        answers: formattedAnswers,
      },
      {
        onSuccess: (response) => {
          console.log("🎯 Quiz result:", response);

          setResult(response.result);
        },
      }
    );
  }

  // -----------------------------------------
  // Get option text
  // -----------------------------------------

  function getOptionText(question, value) {
    if (value === 1) return question.optionA;
    if (value === 2) return question.optionB;
    if (value === 3) return question.optionC;
    if (value === 4) return question.optionD;

    return "Not answered";
  }

  // -----------------------------------------
  // Answer button
  // -----------------------------------------

  function AnswerButton({
    questionId,
    value,
    label,
    text,
  }) {
    const selected =
      answers[questionId] === value;

    return (
      <button
        type="button"
        onClick={() =>
          handleAnswer(questionId, value)
        }
        className={`w-full rounded-2xl border p-4 text-left transition ${
          selected
            ? "border-cyan-400 bg-cyan-500/10 text-white"
            : "border-white/10 bg-[#18181B] text-slate-300 hover:border-cyan-400/50 hover:bg-white/5"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
              selected
                ? "bg-cyan-500 text-white"
                : "bg-[#27272A] text-slate-400"
            }`}
          >
            {label}
          </span>

          <span className="break-words">
            {text}
          </span>
        </div>
      </button>
    );
  }

  // -----------------------------------------
  // Result
  // -----------------------------------------

  if (result) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-4xl">

          {/* Score Header */}

          <div className="rounded-3xl border border-white/10 bg-[#18181B] p-8 text-center">

            <div className="text-5xl">
              {result.percentage >= 70
                ? "🎉"
                : "📚"}
            </div>

            <h1 className="mt-5 text-4xl font-black text-white">
              Quiz Complete!
            </h1>

            <p className="mt-3 text-slate-400">
              You scored
            </p>

            <div className="mt-4 text-6xl font-black text-emerald-400">
              {result.percentage}%
            </div>

            <p className="mt-3 text-lg text-slate-300">
              {result.score} /{" "}
              {result.totalQuestions} correct

              {result.xpEarned !== undefined && (
  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-bold text-yellow-400">
    ⭐ +{result.xpEarned} XP
  </div>
)}
            </p>

          </div>

          {/* Review */}

          <div className="mt-8 space-y-6">

            <h2 className="text-2xl font-bold text-white">
              Review Your Answers
            </h2>

            {result.results?.map(
              (item, index) => (
                <div
                  key={item.questionId}
                  className={`rounded-3xl border p-6 ${
                    item.isCorrect
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                >

                  {/* Question */}

                  <div className="flex gap-4">

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
                        item.isCorrect
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.isCorrect
                        ? "✓"
                        : "✕"}
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-500">
                        Question {index + 1}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-white">
                        {item.question}
                      </h3>

                    </div>

                  </div>

                  {/* Your Answer */}

                  <div className="mt-6 space-y-4">

                    <div>

                      <p className="text-sm text-slate-500">
                        Your answer
                      </p>

                      <p
                        className={`mt-1 font-semibold ${
                          item.isCorrect
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {getOptionText(
                          item,
                          item.selectedAnswer
                        )}
                      </p>

                    </div>

                    {/* Correct Answer */}

                    {!item.isCorrect && (
                      <div>

                        <p className="text-sm text-slate-500">
                          Correct answer
                        </p>

                        <p className="mt-1 font-semibold text-emerald-400">
                          {getOptionText(
                            item,
                            item.correctAnswer
                          )}
                        </p>

                      </div>
                    )}

                  </div>

                  {/* Explanation */}

                  {item.explanation && (
                    <div className="mt-6 rounded-2xl bg-black/20 p-4">

                      <p className="text-sm font-bold text-cyan-400">
                        💡 Explanation
                      </p>

                      <p className="mt-2 leading-6 text-slate-300">
                        {item.explanation}
                      </p>

                    </div>
                  )}

                </div>
              )
            )}

          </div>

          {/* Back */}

         <div className="mt-8 grid gap-3 sm:grid-cols-2">
  <button
    type="button"
    onClick={() => window.history.back()}
    className="w-full rounded-2xl border border-white/10 bg-[#18181B] py-4 font-bold text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
  >
    ← Back to Lesson
  </button>

  <button
    type="button"
    onClick={() => navigate("/dashboard")}
    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-white transition hover:scale-[1.01]"
  >
    🏠 Back to Dashboard
  </button>
</div>

        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------------------
  // Quiz UI
  // -----------------------------------------

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}

        <div className="mb-10">

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            📝 Lesson Quiz
          </span>

          <h1 className="mt-5 text-4xl font-black text-white">
            Test Your Knowledge
          </h1>

          <p className="mt-3 text-slate-400">
            Answer the questions below and submit
            your quiz when you're ready.
          </p>

        </div>

        {/* Questions */}

        <div className="space-y-8">

          {questions.map(
            (question, index) => (
              <div
                key={question.id}
                className="rounded-3xl border border-white/10 bg-[#18181B] p-6"
              >

                {/* Question */}

                <div className="flex gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-bold text-cyan-400">
                    {index + 1}
                  </div>

                  <h2 className="text-lg font-bold leading-7 text-white">
                    {question.question}
                  </h2>

                </div>

                {/* Answers */}

                <div className="mt-6 grid gap-3">

                  <AnswerButton
                    questionId={question.id}
                    value={1}
                    label="A"
                    text={question.optionA}
                  />

                  <AnswerButton
                    questionId={question.id}
                    value={2}
                    label="B"
                    text={question.optionB}
                  />

                  <AnswerButton
                    questionId={question.id}
                    value={3}
                    label="C"
                    text={question.optionC}
                  />

                  <AnswerButton
                    questionId={question.id}
                    value={4}
                    label="D"
                    text={question.optionD}
                  />

                </div>

              </div>
            )
          )}

        </div>

        {/* Submit */}

        <div className="mt-8">

          <button
            type="button"
            disabled={
              submitMutation.isPending ||
              questions.length === 0 ||
              Object.keys(answers).length !==
                questions.length
            }
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitMutation.isPending
              ? "Submitting Quiz..."
              : Object.keys(answers).length !==
                questions.length
              ? `Answer all questions (${Object.keys(answers).length}/${questions.length})`
              : "Submit Quiz"}
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}
