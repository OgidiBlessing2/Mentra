
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Brain,
  Lightbulb,
  Code2,
  Trash2,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Loader2,
  ImageIcon,
} from "lucide-react";

import { useAuth } from "@clerk/clerk-react";

import DashboardLayout from "../../layout/DashboardLayout";

import {
  sendMentorMessage,
  generateMentorImage,
} from "../../api/global-mentor.api";
import {
  generateQuiz,
  submitQuiz,
} from "../../api/quiz.api";
import { getCurrentLesson } from "../../api/lesson.api";

const quickPrompts = [
  {
    label: "Explain a concept",
    prompt:
      "Explain a difficult concept to me in a simple way.",
    icon: Lightbulb,
  },
  {
    label: "Help with coding",
    prompt:
      "Help me understand a programming problem.",
    icon: Code2,
  },
  {
    label: "Quiz me",
    prompt:
      "Quiz me on what I am currently learning.",
    icon: Brain,
  },
  {
    label: "Study plan",
    prompt:
      "Help me create a study plan for my current learning goals.",
    icon: BookOpen,
  },
];

export default function Mentor() {
  const { getToken } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // -----------------------------------------
  // Quiz state
  // -----------------------------------------

  const [quizMode, setQuizMode] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [quizSubmitting, setQuizSubmitting] =
    useState(false);

  const [quizResult, setQuizResult] = useState(null);

  const messagesEndRef = useRef(null);

  // -----------------------------------------
  // Auto scroll chat
  // -----------------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // -----------------------------------------
  // Normal AI Mentor message
  // -----------------------------------------

  const sendMessage = async (
    messageText = input
  ) => {
    const text = messageText.trim();

    if (!text || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMentorMessage(
        text,
        getToken
      );

      const aiMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          response?.answer ||
          "I couldn't generate a response.",
      };

      setMessages((current) => [
        ...current,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "❌ Mentor message error:",
        error
      );

      console.error(
        "❌ Backend response:",
        error?.response?.data
      );

      const errorMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong while contacting your AI Mentor. Please try again.",
        isError: true,
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateVisual = async () => {
  const text = input.trim();

  if (!text || isGeneratingImage || isTyping) {
    return;
  }

  try {
    setIsGeneratingImage(true);

    // Show the user's request in the conversation
    setMessages((prev) => [
      ...prev,
      {
        id: `user-image-${Date.now()}`,
        role: "user",
        content: text,
      },
    ]);

    setInput("");

    const response = await generateMentorImage(
      text,
      getToken
    );

    if (!response?.image) {
      throw new Error(
        "No image was returned by the AI."
      );
    }

    const mimeType =
      response.mimeType || "image/png";

    const imageUrl = `data:${mimeType};base64,${response.image}`;

    setMessages((prev) => [
      ...prev,
      {
        id: `mentor-image-${Date.now()}`,
        role: "assistant",
        content: `Here's an educational visual for: "${text}"`,
        imageUrl,
      },
    ]);
  } catch (error) {
    console.error(
      "IMAGE GENERATION ERROR:",
      error
    );

    setMessages((prev) => [
      ...prev,
      {
        id: `image-error-${Date.now()}`,
        role: "assistant",
        content:
          "I couldn't generate that visual right now. Please try again.",
      },
    ]);
  } finally {
    setIsGeneratingImage(false);
  }
};

  // -----------------------------------------
  // Start Quiz
  // -----------------------------------------

  const startQuiz = async () => {
    if (quizLoading) return;

    setQuizLoading(true);
    setQuizError("");
    setQuizResult(null);
    setQuiz(null);
    setAnswers([]);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setQuizMode(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token was not generated."
        );
      }

      // -----------------------------------------
      // Get student's current lesson
      // -----------------------------------------

      console.log(
        "📚 Getting current lesson..."
      );

      const lessonResponse =
        await getCurrentLesson(token);

      console.log(
        "📚 Current lesson response:",
        lessonResponse
      );

      const lesson =
        lessonResponse?.lesson ||
        lessonResponse?.data?.lesson ||
        lessonResponse?.data ||
        lessonResponse;

      if (!lesson?.id) {
        throw new Error(
          "Could not determine your current lesson."
        );
      }

      console.log(
        "📖 Current lesson:",
        lesson.title,
        lesson.id
      );

      // -----------------------------------------
      // Generate/retrieve quiz
      // -----------------------------------------

      console.log(
        "🧠 Getting quiz for lesson:",
        lesson.id
      );

      const quizResponse =
        await generateQuiz(
          lesson.id,
          token
        );

      console.log(
        "🧠 Quiz response:",
        quizResponse
      );

      const generatedQuiz =
        quizResponse?.quiz ||
        quizResponse?.data?.quiz ||
        quizResponse?.data ||
        quizResponse;

      if (
        !generatedQuiz?.id ||
        !Array.isArray(
          generatedQuiz.questions
        ) ||
        generatedQuiz.questions.length === 0
      ) {
        throw new Error(
          "No quiz questions were returned."
        );
      }

      setQuiz({
        ...generatedQuiz,
        lessonTitle:
          lesson.title || "Current Lesson",
      });

      setQuizMode(true);
    } catch (error) {
      console.error(
        "❌ Start quiz error:",
        error
      );

      console.error(
        "❌ Quiz backend response:",
        error?.response?.data
      );

      setQuizError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start the quiz. Please try again."
      );

      setQuizMode(false);
    } finally {
      setQuizLoading(false);
    }
  };

  // -----------------------------------------
  // Select answer
  // -----------------------------------------

  const handleAnswerSelect = (answer) => {
    if (quizSubmitting) return;

    setSelectedAnswer(answer);
  };

  // -----------------------------------------
  // Save current answer and move next
  // -----------------------------------------

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion =
      quiz.questions[currentQuestionIndex];

    const updatedAnswers = [
      ...answers.filter(
        (answer) =>
          answer.questionId !==
          currentQuestion.id
      ),
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
      },
    ];

    setAnswers(updatedAnswers);

    if (
      currentQuestionIndex <
      quiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(
        (current) => current + 1
      );

      setSelectedAnswer(null);
    }
  };

  // -----------------------------------------
  // Submit quiz
  // -----------------------------------------

  const handleSubmitQuiz = async () => {
    if (
      selectedAnswer === null ||
      quizSubmitting
    ) {
      return;
    }

    const currentQuestion =
      quiz.questions[currentQuestionIndex];

    const finalAnswers = [
      ...answers.filter(
        (answer) =>
          answer.questionId !==
          currentQuestion.id
      ),
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
      },
    ];

    setAnswers(finalAnswers);
    setQuizSubmitting(true);
    setQuizError("");

    try {
      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token was not generated."
        );
      }

      console.log(
        "📝 Submitting quiz:",
        quiz.id
      );

      const response = await submitQuiz(
        quiz.id,
        finalAnswers,
        token
      );

      console.log(
        "🏆 Quiz result:",
        response
      );

      const result =
        response?.result ||
        response?.data?.result ||
        response?.data ||
        response;

      setQuizResult(result);
    } catch (error) {
      console.error(
        "❌ Submit quiz error:",
        error
      );

      console.error(
        "❌ Submit backend response:",
        error?.response?.data
      );

      setQuizError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit the quiz."
      );
    } finally {
      setQuizSubmitting(false);
    }
  };

  // -----------------------------------------
  // Restart quiz
  // -----------------------------------------

  const restartQuiz = () => {
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setQuizError("");

    if (quiz) {
      setQuizMode(true);
    } else {
      startQuiz();
    }
  };

  // -----------------------------------------
  // Exit quiz
  // -----------------------------------------

  const exitQuiz = () => {
    setQuizMode(false);
    setQuiz(null);
    setQuizResult(null);
    setQuizError("");
    setAnswers([]);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
  };

  // -----------------------------------------
  // Submit normal chat
  // -----------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  // -----------------------------------------
  // Render
  // -----------------------------------------

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-120px)] min-w-0 flex-col">

        {/* ----------------------------------- */}
        {/* Header */}
        {/* ----------------------------------- */}

        <section className="mb-6 flex flex-col gap-4 rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex min-w-0 items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20">
              <Sparkles size={27} />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-black text-[var(--mentra-text)] sm:text-3xl">
                  AI Mentor
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Online

                </span>

              </div>

              <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
                Your personal AI learning companion.
              </p>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--mentra-text-muted)] transition hover:border-red-500/30 hover:text-red-400"
              >
                <Trash2 size={16} />
                Clear chat
              </button>
            )}

            {quizMode && (
              <button
                type="button"
                onClick={exitQuiz}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
              >
                Exit Quiz
              </button>
            )}

          </div>

        </section>

        {/* ----------------------------------- */}
        {/* Quiz Mode */}
        {/* ----------------------------------- */}

        {quizMode ? (
          <QuizMode
            quiz={quiz}
            quizLoading={quizLoading}
            quizError={quizError}
            quizResult={quizResult}
            currentQuestionIndex={
              currentQuestionIndex
            }
            selectedAnswer={selectedAnswer}
            quizSubmitting={quizSubmitting}
            onStartQuiz={startQuiz}
            onSelectAnswer={
              handleAnswerSelect
            }
            onNextQuestion={
              handleNextQuestion
            }
            onSubmitQuiz={
              handleSubmitQuiz
            }
            onRestartQuiz={restartQuiz}
            onExitQuiz={exitQuiz}
          />
        ) : (

          /* ----------------------------------- */
          /* Normal Chat */
          /* ----------------------------------- */

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

              {messages.length === 0 ? (
                <WelcomeState
                  onPrompt={(prompt) => {

                    if (
                      prompt ===
                      "Quiz me on what I am currently learning."
                    ) {
                      startQuiz();
                    } else {
                      sendMessage(prompt);
                    }

                  }}
                  onQuiz={startQuiz}
                />
              ) : (

                <div className="mx-auto w-full max-w-4xl space-y-6">

                  {messages.map(
                    (message) => (
                      <Message
                        key={message.id}
                        message={message}
                      />
                    )
                  )}

                  {isTyping && (
                    <TypingIndicator />
                  )}

                  <div ref={messagesEndRef} />

                </div>

              )}

            </div>

            <div className="border-t border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4 sm:p-5">

              <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-4xl"
              >

                <div className="relative overflow-hidden rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] transition focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/10">

                  <textarea
                    value={input}
                    onChange={(event) =>
                      setInput(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    placeholder="Ask your AI Mentor anything..."
                    rows={1}
                    disabled={isTyping}
                    className="block min-h-[56px] w-full resize-none bg-transparent px-5 py-4 pr-28 text-sm text-[var(--mentra-text)] outline-none placeholder:text-[var(--mentra-text-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
  type="button"
  onClick={generateVisual}
  disabled={
    !input.trim() ||
    isTyping ||
    isGeneratingImage
  }
  title="Generate visual"
  className="absolute bottom-2.5 right-14 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] text-violet-400 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40"
>
  {isGeneratingImage ? (
    <Loader2
      size={18}
      className="animate-spin"
    />
  ) : (
    <ImageIcon size={18} />
  )}
</button>

                  <button
                    type="submit"
                    disabled={
                      !input.trim() ||
                      isTyping
                    }
                    className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={18} />
                  </button>

                </div>

                <p className="mt-2 text-center text-xs text-[var(--mentra-text-subtle)]">
                  Press Enter to send • Shift +
                  Enter for a new line
                </p>

              </form>

            </div>

          </section>
        )}

      </div>
    </DashboardLayout>
  );
}

/*
|--------------------------------------------------------------------------
| Welcome State
|--------------------------------------------------------------------------
*/

function WelcomeState({
  onPrompt,
  onQuiz,
}) {
  return (
    <div className="mx-auto flex min-h-[500px] w-full max-w-4xl flex-col items-center justify-center px-2 py-10 text-center">

      <div className="relative">

        <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-2xl shadow-violet-500/20">
          <Sparkles size={36} />
        </div>

      </div>

      <h2 className="mt-8 text-3xl font-black text-[var(--mentra-text)] sm:text-4xl">
        How can I help you learn?
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--mentra-text-muted)] sm:text-base">
        Ask me to explain a concept, help with
        code, quiz you, or create a study
        strategy for your learning journey.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">

        {quickPrompts.map((item) => {

          const Icon = item.icon;

          const isQuiz =
            item.label === "Quiz me";

          return (
            <button
              key={item.label}
              type="button"
              onClick={() =>
                isQuiz
                  ? onQuiz()
                  : onPrompt(item.prompt)
              }
              className="group flex items-center gap-4 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/15">
                <Icon size={20} />
              </div>

              <div className="min-w-0">

                <p className="font-semibold text-[var(--mentra-text)]">
                  {item.label}
                </p>

                <p className="mt-1 truncate text-xs text-[var(--mentra-text-muted)]">
                  {item.prompt}
                </p>

              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Quiz Mode
|--------------------------------------------------------------------------
*/

function QuizMode({
  quiz,
  quizLoading,
  quizError,
  quizResult,
  currentQuestionIndex,
  selectedAnswer,
  quizSubmitting,
  onStartQuiz,
  onSelectAnswer,
  onNextQuestion,
  onSubmitQuiz,
  onRestartQuiz,
  onExitQuiz,
}) {

  if (quizLoading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

        <div className="flex flex-col items-center text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <Loader2
              size={30}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--mentra-text)]">
            Preparing your quiz...
          </h2>

          <p className="mt-2 max-w-sm text-sm text-[var(--mentra-text-muted)]">
            Mentra is finding your current
            lesson and preparing questions
            based on what you're learning.
          </p>

        </div>

      </div>
    );
  }

  if (quizError) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6">

        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <XCircle size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[var(--mentra-text)]">
            We couldn't start the quiz
          </h2>

          <p className="mt-3 text-sm leading-6 text-red-400">
            {quizError}
          </p>

          <div className="mt-6 flex justify-center gap-3">

            <button
              type="button"
              onClick={onStartQuiz}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <RotateCcw size={16} />
              Try again
            </button>

            <button
              type="button"
              onClick={onExitQuiz}
              className="rounded-xl border border-[var(--mentra-border)] px-5 py-3 text-sm font-semibold text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
            >
              Exit
            </button>

          </div>

        </div>

      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (quizResult) {
    return (
      <QuizResults
        result={quizResult}
        onRestart={onRestartQuiz}
        onExit={onExitQuiz}
      />
    );
  }

  const questions = quiz.questions || [];

  const question =
    questions[currentQuestionIndex];

  if (!question) {
    return null;
  }

  const questionNumber =
    currentQuestionIndex + 1;

  const totalQuestions =
    questions.length;

  const progress =
    (questionNumber /
      totalQuestions) *
    100;

  const options = [
    {
      number: 1,
      text: question.optionA,
    },
    {
      number: 2,
      text: question.optionB,
    },
    {
      number: 3,
      text: question.optionC,
    },
    {
      number: 4,
      text: question.optionD,
    },
  ];

  const isLastQuestion =
    currentQuestionIndex ===
    totalQuestions - 1;

  return (
    <section className="flex flex-1 flex-col rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 sm:p-6 lg:p-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* Quiz header */}

        <div className="mb-8">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>

              <div className="flex items-center gap-2 text-sm font-semibold text-violet-400">

                <Brain size={17} />

                Quiz Mode

              </div>

              <h2 className="mt-1 text-xl font-black text-[var(--mentra-text)] sm:text-2xl">
                {quiz.lessonTitle}
              </h2>

            </div>

            <div className="rounded-full border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-2 text-sm font-bold text-[var(--mentra-text)]">
              {questionNumber} /{" "}
              {totalQuestions}
            </div>

          </div>

          {/* Progress */}

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--mentra-surface)]">

            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question */}

        <div className="rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 sm:p-7">

          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            Question {questionNumber}
          </span>

          <h3 className="mt-4 text-xl font-bold leading-8 text-[var(--mentra-text)] sm:text-2xl">
            {question.question}
          </h3>

          {/* Options */}

          <div className="mt-8 space-y-3">

            {options.map((option) => {

              const isSelected =
                selectedAnswer ===
                option.number;

              return (


                <button
                  key={option.number}
                  type="button"
                  onClick={() =>
                    onSelectAnswer(
                      option.number
                    )
                  }
                  disabled={quizSubmitting}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/5"
                      : "border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] hover:border-violet-500/40 hover:bg-violet-500/5"
                  }`}
                >

                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${
                      isSelected
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-[var(--mentra-border)] text-[var(--mentra-text-muted)] group-hover:border-violet-500/40 group-hover:text-violet-400"
                    }`}
                  >
                    {String.fromCharCode(
                      64 + option.number
                    )}
                  </span>

                  <span
                    className={`text-sm leading-6 ${
                      isSelected
                        ? "font-semibold text-[var(--mentra-text)]"
                        : "text-[var(--mentra-text-muted)]"
                    }`}
                  >
                    {option.text}
                  </span>

                </button>
              );
            })}

          </div>

          {/* Actions */}

          <div className="mt-8 flex justify-end">

            {isLastQuestion ? (

              <button
                type="button"
                disabled={
                  selectedAnswer === null ||
                  quizSubmitting
                }
                onClick={onSubmitQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {quizSubmitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Trophy size={17} />
                    Submit Quiz
                  </>
                )}

              </button>

            ) : (

              <button
                type="button"
                disabled={
                  selectedAnswer === null
                }
                onClick={onNextQuestion}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next Question
                <ArrowRight size={17} />
              </button>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Quiz Results
|--------------------------------------------------------------------------
*/

function QuizResults({
  result,
  onRestart,
  onExit,
}) {
  const percentage =
    result.percentage ?? 0;

  const score =
    result.score ?? 0;

  const total =
    result.totalQuestions ?? 0;

  const xpEarned =
    result.xpEarned ?? 0;

  const level =
    result.level ?? 1;

  const streak =
    result.streak ?? 0;

  const unlockedAchievements =
    result.unlockedAchievements || [];

  const results =
    result.results || [];

  return (
    <section className="flex flex-1 overflow-y-auto rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 sm:p-6 lg:p-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* Score hero */}

        <div className="rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 text-center sm:p-8">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-2xl shadow-violet-500/20">
            <Trophy size={38} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-violet-400">
            Quiz Complete
          </p>

          <h2 className="mt-2 text-4xl font-black text-[var(--mentra-text)] sm:text-5xl">
            {percentage}%
          </h2>

          <p className="mt-3 text-sm text-[var(--mentra-text-muted)]">
            You scored{" "}
            <strong className="text-[var(--mentra-text)]">
              {score}
            </strong>{" "}
            out of{" "}
            <strong className="text-[var(--mentra-text)]">
              {total}
            </strong>{" "}
            questions correctly.
          </p>

          {/* Stats */}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <ResultStat
              label="XP Earned"
              value={`+${xpEarned}`}
            />

            <ResultStat
              label="Level"
              value={level}
            />

            <ResultStat
              label="Streak"
              value={`${streak} 🔥`}
            />

            <ResultStat
              label="Score"
              value={`${score}/${total}`}
            />

          </div>

        </div>

        {/* Achievements */}

        {unlockedAchievements.length >
          0 && (
          <div className="mt-5 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                <Trophy size={19} />
              </div>

              <div>

                <h3 className="font-bold text-[var(--mentra-text)]">
                  Achievement Unlocked!
                </h3>

                <p className="text-xs text-[var(--mentra-text-muted)]">
                  Keep learning to unlock more.
                </p>

              </div>

            </div>

            <div className="mt-4 space-y-2">

              {unlockedAchievements.map(
                (achievement, index) => (
                  <div
                    key={
                      achievement.id ||
                      achievement.name ||
                      index
                    }
                    className="rounded-xl bg-yellow-500/5 px-4 py-3 text-sm font-semibold text-yellow-400"
                  >
                    {achievement.name ||
                      achievement.title ||
                      "New Achievement"}
                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* Review */}

        {results.length > 0 && (
          <div className="mt-5 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 sm:p-6">

            <h3 className="text-lg font-bold text-[var(--mentra-text)]">
              Review your answers
            </h3>

            <div className="mt-5 space-y-4">

              {results.map(
                (item, index) => (
                  <div
                    key={
                      item.questionId ||
                      index
                    }
                    className={`rounded-2xl border p-4 ${
                      item.isCorrect
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-red-500/20 bg-red-500/5"
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      {item.isCorrect ? (
                        <CheckCircle2
                          size={20}
                          className="mt-0.5 shrink-0 text-emerald-400"
                        />
                      ) : (
                        <XCircle
                          size={20}
                          className="mt-0.5 shrink-0 text-red-400"
                        />
                      )}

                      <div className="min-w-0">

                        <p className="text-sm font-semibold leading-6 text-[var(--mentra-text)]">
                          {index + 1}.{" "}
                          {item.question}
                        </p>

                        <p className="mt-2 text-xs text-[var(--mentra-text-muted)]">
                          Your answer:{" "}
                          {getAnswerText(
                            item
                          )}
                        </p>

                        {!item.isCorrect && (
                          <p className="mt-1 text-xs text-emerald-400">
                            Correct answer:{" "}
                            {getCorrectAnswerText(
                              item
                            )}
                          </p>
                        )}

                        {item.explanation && (
                          <p className="mt-3 border-t border-[var(--mentra-border)] pt-3 text-xs leading-5 text-[var(--mentra-text-muted)]">
                            <strong className="text-[var(--mentra-text)]">
                              Explanation:
                            </strong>{" "}
                            {item.explanation}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* Actions */}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            <RotateCcw size={17} />
            Try Again
          </button>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-6 py-3 text-sm font-bold text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
          >
            Back to Mentor
          </button>

        </div>

      </div>

    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Result Stat
|--------------------------------------------------------------------------
*/

function ResultStat({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4">

      <p className="text-xs text-[var(--mentra-text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[var(--mentra-text)]">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Answer helpers
|--------------------------------------------------------------------------
*/

function getAnswerText(result) {
  const answers = {
    1: result.optionA,
    2: result.optionB,
    3: result.optionC,
    4: result.optionD,
  };

  return (
    answers[result.selectedAnswer] ||
    "Not answered"
  );
}

function getCorrectAnswerText(result) {
  const answers = {
    1: result.optionA,
    2: result.optionB,
    3: result.optionC,
    4: result.optionD,
  };

  return (
    answers[result.correctAnswer] ||
    "Unknown"
  );
}

/*
|--------------------------------------------------------------------------
| Chat Message
|--------------------------------------------------------------------------
*/

function Message({ message }) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex gap-3 sm:gap-4 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/10">
          <Bot size={19} />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10"
            : message.isError
              ? "rounded-bl-md border border-red-500/20 bg-red-500/5 text-red-400"
              : "rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] text-[var(--mentra-text)]"
        }`}
      >
        {message.imageUrl && (
  <div className="mb-3 overflow-hidden rounded-xl border border-[var(--mentra-border)]">
    <img
      src={message.imageUrl}
      alt="AI generated educational visual"
      className="block w-full rounded-xl"
    />
  </div>
)}

<div className="whitespace-pre-wrap break-words">
  {message.content}
</div>
      </div>

      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--mentra-surface)] text-[var(--mentra-text-muted)]">
          <User size={19} />
        </div>
      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Typing Indicator
|--------------------------------------------------------------------------
*/

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
        <Bot size={19} />
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-5 py-4">

        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />

        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />

        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />

      </div>

    </div>
  );
}
