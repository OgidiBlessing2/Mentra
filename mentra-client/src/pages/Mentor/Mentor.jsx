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
  MessageSquare,
  Wand2,
  GraduationCap,
  Zap,
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
    description: "Break down something difficult",
    prompt: "Explain a difficult concept to me in a simple way.",
    icon: Lightbulb,
  },
  {
    label: "Help with coding",
    description: "Understand a programming problem",
    prompt: "Help me understand a programming problem.",
    icon: Code2,
  },
  {
    label: "Quiz me",
    description: "Test what I currently know",
    prompt: "Quiz me on what I am currently learning.",
    icon: Brain,
  },
  {
    label: "Study plan",
    description: "Build a smarter study routine",
    prompt:
      "Help me create a study plan for my current learning goals.",
    icon: BookOpen,
  },
];

const mentorModes = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
  },
  {
    id: "visual",
    label: "Visual",
    icon: ImageIcon,
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: Brain,
  },
];

export default function Mentor() {
  const { getToken } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [activeMode, setActiveMode] = useState("chat");

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /*
   * ============================
   * CHAT
   * ============================
   */

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (!text || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);
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

  /*
   * ============================
   * IMAGE GENERATION
   * ============================
   */

  const generateVisual = async () => {
    const text = input.trim();

    if (
      !text ||
      isGeneratingImage ||
      isTyping
    ) {
      return;
    }

    try {
      setIsGeneratingImage(true);

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
          isError: true,
        },
      ]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  /*
   * ============================
   * QUIZ
   * ============================
   */

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
          lesson.title ||
          "Current Lesson",
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

  const handleAnswerSelect = (answer) => {
    if (quizSubmitting) return;

    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion =
      quiz.questions[
        currentQuestionIndex
      ];

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

  const handleSubmitQuiz = async () => {
    if (
      selectedAnswer === null ||
      quizSubmitting
    ) {
      return;
    }

    const currentQuestion =
      quiz.questions[
        currentQuestionIndex
      ];

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

  const exitQuiz = () => {
    setQuizMode(false);
    setQuiz(null);
    setQuizResult(null);
    setQuizError("");
    setAnswers([]);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setActiveMode("chat");
  };

  /*
   * ============================
   * INPUT
   * ============================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (activeMode === "visual") {
      generateVisual();
      return;
    }

    if (activeMode === "quiz") {
      startQuiz();
      return;
    }

    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (activeMode === "visual") {
        generateVisual();
      } else if (activeMode === "quiz") {
        startQuiz();
      } else {
        sendMessage();
      }
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);

    if (mode === "quiz") {
      setInput("");
      return;
    }

    if (mode === "visual") {
      setInput("");
      return;
    }

    textareaRef.current?.focus();
  };

  const clearConversation = () => {
    setMessages([]);
  };

  /*
   * ============================
   * RENDER
   * ============================
   */

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-120px)] min-w-0 flex-col">

        {/* ================= HEADER ================= */}

        <section className="mb-5 flex flex-col gap-4 rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex min-w-0 items-center gap-4">

            <div className="relative shrink-0">

              <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-xl" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20">
                <Sparkles size={26} />
              </div>

            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-black tracking-tight text-[var(--mentra-text)] sm:text-3xl">
                  AI Mentor
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>

              </div>

              <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
                Your personal AI learning companion.
              </p>

            </div>

          </div>

          <div className="flex flex-wrap items-center gap-2">

            <div className="hidden items-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3 py-2 text-xs text-[var(--mentra-text-muted)] sm:flex">
              <Zap
                size={14}
                className="text-amber-400"
              />
              Smart learning
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--mentra-text-muted)] transition hover:border-red-500/30 hover:text-red-400"
              >
                <Trash2 size={15} />
                Clear
              </button>
            )}

            {quizMode && (
              <button
                type="button"
                onClick={exitQuiz}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
              >
                Exit Quiz
              </button>
            )}

          </div>

        </section>

        {/* ================= MAIN ================= */}

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
            onSelectAnswer={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            onSubmitQuiz={handleSubmitQuiz}
            onRestartQuiz={restartQuiz}
            onExitQuiz={exitQuiz}
          />
        ) : (
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] shadow-sm">

            {/* Conversation */}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

              {messages.length === 0 ? (
                <WelcomeState
                  onPrompt={(prompt) => {
                    setActiveMode("chat");
                    sendMessage(prompt);
                  }}
                  onQuiz={() => {
                    setActiveMode("quiz");
                    startQuiz();
                  }}
                  onVisual={() => {
                    setActiveMode("visual");
                    setInput(
                      "Create an educational visual explaining "
                    );

                    setTimeout(() => {
                      textareaRef.current?.focus();
                    }, 50);
                  }}
                />
              ) : (
                <div className="mx-auto w-full max-w-4xl space-y-7">

                  {messages.map((message) => (
                    <Message
                      key={message.id}
                      message={message}
                    />
                  ))}

                  {isTyping && (
                    <TypingIndicator />
                  )}

                  {isGeneratingImage && (
                    <ImageGeneratingIndicator />
                  )}

                  <div ref={messagesEndRef} />

                </div>
              )}

            </div>

            {/* ================= COMPOSER ================= */}

            <div className="border-t border-[var(--mentra-border)] bg-[var(--mentra-surface)]/90 p-4 backdrop-blur-xl sm:p-5">

              <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-4xl"
              >

                {/* Modes */}

                <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">

                  {mentorModes.map((mode) => {
                    const Icon = mode.icon;
                    const active =
                      activeMode === mode.id;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() =>
                          handleModeChange(
                            mode.id
                          )
                        }
                        className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                          active
                            ? "border-violet-500/40 bg-violet-500/10 text-violet-400 shadow-sm"
                            : "border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] text-[var(--mentra-text-muted)] hover:text-[var(--mentra-text)]"
                        }`}
                      >
                        <Icon size={14} />
                        {mode.label}
                      </button>
                    );
                  })}

                  <div className="ml-auto hidden items-center gap-1.5 text-[10px] text-[var(--mentra-text-subtle)] sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    AI ready
                  </div>

                </div>

                {/* Composer box */}

                <div className="overflow-hidden rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] shadow-lg transition focus-within:border-violet-500/40 focus-within:shadow-violet-500/5">

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(event) =>
                      setInput(
                        event.target.value
                      )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={
                      activeMode ===
                      "visual"
                        ? "Describe the visual you want to create..."
                        : activeMode ===
                            "quiz"
                          ? "Ready to test your knowledge?"
                          : "Ask your AI Mentor anything..."
                    }
                    rows={2}
                    disabled={
                      isTyping ||
                      isGeneratingImage ||
                      activeMode === "quiz"
                    }
                    className="block min-h-[76px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-6 text-[var(--mentra-text)] outline-none placeholder:text-[var(--mentra-text-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="flex items-center justify-between border-t border-[var(--mentra-border)] px-3 py-2.5">

                    <div className="flex min-w-0 items-center gap-2">

                      <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--mentra-surface)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--mentra-text-muted)]">
                        {activeMode ===
                        "visual" ? (
                          <>
                            <ImageIcon
                              size={12}
                              className="text-violet-400"
                            />
                            Visual AI
                          </>
                        ) : activeMode ===
                          "quiz" ? (
                          <>
                            <Brain
                              size={12}
                              className="text-violet-400"
                            />
                            Smart Quiz
                          </>
                        ) : (
                          <>
                            <Sparkles
                              size={12}
                              className="text-violet-400"
                            />
                            Mentor
                          </>
                        )}
                      </div>

                      <span className="hidden truncate text-[10px] text-[var(--mentra-text-subtle)] sm:block">
                        {activeMode ===
                        "visual"
                          ? "AI image generation"
                          : activeMode ===
                              "quiz"
                            ? "Questions from your current lesson"
                            : "Personalized learning assistance"}
                      </span>

                    </div>

                    <button
                      type="submit"
                      disabled={
                        activeMode ===
                        "quiz"
                          ? quizLoading
                          : !input.trim() ||
                            isTyping ||
                            isGeneratingImage
                      }
                      className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >

                      {isTyping ||
                      isGeneratingImage ||
                      quizLoading ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          <span className="hidden sm:inline">
                            Working...
                          </span>
                        </>
                      ) : activeMode ===
                        "visual" ? (
                        <>
                          <Wand2 size={16} />
                          <span>
                            Create
                          </span>
                        </>
                      ) : activeMode ===
                        "quiz" ? (
                        <>
                          <Brain size={16} />
                          <span>
                            Start Quiz
                          </span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>
                            Send
                          </span>
                        </>
                      )}

                    </button>

                  </div>

                </div>

                <p className="mt-2 text-center text-[10px] text-[var(--mentra-text-subtle)]">
                  Enter to send • Shift + Enter for a new line
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
 * =========================================================
 * WELCOME STATE
 * =========================================================
 */

function WelcomeState({
  onPrompt,
  onQuiz,
  onVisual,
}) {
  return (
    <div className="mx-auto flex min-h-[600px] w-full max-w-5xl flex-col justify-center px-1 py-10">

      {/* Hero */}

      <div className="text-center">

        <div className="relative mx-auto w-fit">

          <div className="absolute inset-0 rounded-[30px] bg-violet-500/25 blur-3xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-violet-500/30">
            <Sparkles size={35} />
          </div>

        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-violet-400">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Mentra Intelligence
        </div>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-[var(--mentra-text)] sm:text-5xl">
          What are we learning
          <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent sm:inline">
            {" "}today?
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--mentra-text-muted)] sm:text-base">
          Your AI learning companion for
          explanations, coding, visuals, quizzes,
          and smarter study sessions.
        </p>

      </div>

      {/* Quick actions */}

      <div className="mt-12 grid gap-3 sm:grid-cols-2">

        {quickPrompts.map((item) => {
          const Icon = item.icon;

          const action =
            item.label === "Quiz me"
              ? onQuiz
              : () => onPrompt(item.prompt);

          return (
            <button
              key={item.label}
              type="button"
              onClick={action}
              className="group relative overflow-hidden rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10"
            >

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl transition group-hover:bg-violet-500/10" />

              <div className="relative flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/15">
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-3">

                    <p className="font-bold text-[var(--mentra-text)]">
                      {item.label}
                    </p>

                    <ArrowRight
                      size={17}
                      className="text-[var(--mentra-text-subtle)] transition group-hover:translate-x-1 group-hover:text-violet-400"
                    />

                  </div>

                  <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
                    {item.description}
                  </p>

                </div>

              </div>

            </button>
          );
        })}

      </div>

      {/* Visual shortcut */}

      <button
        type="button"
        onClick={onVisual}
        className="group mt-3 flex w-full items-center gap-4 rounded-3xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] p-4 text-left transition hover:border-violet-500/40 hover:bg-violet-500/[0.06]"
      >

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
          <Wand2 size={19} />
        </div>

        <div className="min-w-0 flex-1">

          <p className="text-sm font-bold text-[var(--mentra-text)]">
            Create an educational visual
          </p>

          <p className="mt-0.5 text-xs text-[var(--mentra-text-muted)]">
            Turn a concept into an AI-generated visual.
          </p>

        </div>

        <ArrowRight
          size={17}
          className="text-[var(--mentra-text-subtle)] transition group-hover:translate-x-1 group-hover:text-violet-400"
        />

      </button>

      {/* Bottom features */}

      <div className="mt-5 grid grid-cols-3 gap-2">

        {[
          {
            title: "AI Mentor",
            subtitle: "Personalized",
          },
          {
            title: "Visual AI",
            subtitle: "Creative",
          },
          {
            title: "Smart Quiz",
            subtitle: "Adaptive",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)]/60 px-3 py-3 text-center"
          >
            <p className="text-xs font-bold text-[var(--mentra-text)]">
              {item.title}
            </p>

            <p className="mt-0.5 text-[10px] text-[var(--mentra-text-subtle)]">
              {item.subtitle}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

/*
 * =========================================================
 * MESSAGE
 * =========================================================
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
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20">
          <Sparkles size={17} />
        </div>
      )}

      <div
        className={`max-w-[90%] sm:max-w-[78%] ${
          isUser
            ? "flex flex-col items-end"
            : ""
        }`}
      >

        {message.imageUrl ? (
          <div className="overflow-hidden rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] shadow-2xl shadow-black/10">

            <div className="relative">

              <img
                src={message.imageUrl}
                alt="AI generated educational visual"
                className="block max-h-[520px] w-full object-cover"
              />

              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
                <Sparkles size={13} />
                AI Visual
              </div>

            </div>

            <div className="p-4">

              <p className="text-sm leading-6 text-[var(--mentra-text)]">
                {message.content}
              </p>

            </div>

          </div>
        ) : (
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              isUser
                ? "rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10"
                : message.isError
                  ? "rounded-bl-md border border-red-500/20 bg-red-500/5 text-red-400"
                  : "rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] text-[var(--mentra-text)] shadow-sm"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        )}

      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] text-[var(--mentra-text-muted)]">
          <User size={17} />
        </div>
      )}

    </div>
  );
}

/*
 * =========================================================
 * TYPING INDICATOR
 * =========================================================
 */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
        <Sparkles size={17} />
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-4">

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

      </div>

    </div>
  );
}

/*
 * =========================================================
 * IMAGE GENERATION INDICATOR
 * =========================================================
 */

function ImageGeneratingIndicator() {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
        <ImageIcon size={17} />
      </div>

      <div className="rounded-2xl rounded-bl-md border border-violet-500/20 bg-violet-500/5 px-4 py-3">

        <div className="flex items-center gap-2">

          <Loader2
            size={15}
            className="animate-spin text-violet-400"
          />

          <span className="text-sm font-medium text-[var(--mentra-text)]">
            Creating your visual...
          </span>

        </div>

        <p className="mt-1 text-xs text-[var(--mentra-text-muted)]">
          Mentra is generating an educational image.
        </p>

      </div>

    </div>
  );
}

/*
 * =========================================================
 * QUIZ MODE
 * =========================================================
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
      <div className="flex min-h-[600px] flex-1 items-center justify-center rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

        <div className="text-center">

          <div className="relative mx-auto w-fit">

            <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Loader2
                size={28}
                className="animate-spin"
              />
            </div>

          </div>

          <h2 className="mt-5 text-xl font-black text-[var(--mentra-text)]">
            Building your quiz
          </h2>

          <p className="mt-2 text-sm text-[var(--mentra-text-muted)]">
            Mentra is preparing questions from your current lesson.
          </p>

        </div>

      </div>
    );
  }

  if (quizError) {
    return (
      <div className="flex min-h-[600px] flex-1 items-center justify-center rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6">

        <div className="w-full max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <XCircle size={30} />
          </div>

          <h2 className="mt-5 text-xl font-black text-[var(--mentra-text)]">
            Quiz couldn't start
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--mentra-text-muted)]">
            {quizError}
          </p>

          <div className="mt-6 flex justify-center gap-2">

            <button
              type="button"
              onClick={onStartQuiz}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              <RotateCcw size={16} />
              Try again
            </button>

            <button
              type="button"
              onClick={onExitQuiz}
              className="rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-2.5 text-sm font-bold text-[var(--mentra-text-muted)]"
            >
              Back
            </button>

          </div>

        </div>

      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[600px] flex-1 items-center justify-center rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

        <div className="text-center">

          <Brain
            size={45}
            className="mx-auto text-violet-400"
          />

          <h2 className="mt-5 text-xl font-black text-[var(--mentra-text)]">
            Ready for a challenge?
          </h2>

          <button
            type="button"
            onClick={onStartQuiz}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-500"
          >
            Start Quiz
          </button>

        </div>

      </div>
    );
  }

  if (quizResult) {
    return (
      <QuizResults
        result={quizResult}
        quiz={quiz}
        onRestart={onRestartQuiz}
        onExit={onExitQuiz}
      />
    );
  }

  const currentQuestion =
    quiz.questions[
      currentQuestionIndex
    ];

  const totalQuestions =
    quiz.questions.length;

  const progress =
    ((currentQuestionIndex + 1) /
      totalQuestions) *
    100;

  const isLastQuestion =
    currentQuestionIndex ===
    totalQuestions - 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

      <div className="mx-auto w-full max-w-3xl p-5 sm:p-8 lg:p-10">

        {/* Quiz header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
              <Brain size={15} />
              SMART QUIZ
            </div>

            <h2 className="mt-1 text-xl font-black text-[var(--mentra-text)] sm:text-2xl">
              {quiz.lessonTitle}
            </h2>

          </div>

          <div className="rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3 py-2 text-xs font-bold text-[var(--mentra-text-muted)]">
            Question{" "}
            {currentQuestionIndex + 1}{" "}
            / {totalQuestions}
          </div>

        </div>

        {/* Progress */}

        <div className="mt-7">

          <div className="h-2 overflow-hidden rounded-full bg-[var(--mentra-surface)]">

            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question */}

        <div className="mt-8 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 sm:p-7">

          <p className="text-lg font-bold leading-7 text-[var(--mentra-text)] sm:text-xl">
            {currentQuestion.question}
          </p>

          <div className="mt-6 space-y-3">

            {currentQuestion.options?.map(
              (option, index) => {
                const selected =
                  selectedAnswer ===
                  option;

                return (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      onSelectAnswer(
                        option
                      )
                    }
                    disabled={
                      quizSubmitting
                    }
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] hover:border-violet-500/30 hover:bg-violet-500/5"
                    }`}
                  >

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        selected
                          ? "bg-violet-600 text-white"
                          : "bg-[var(--mentra-surface)] text-[var(--mentra-text-muted)]"
                      }`}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="flex-1 text-sm font-medium text-[var(--mentra-text)]">
                      {option}
                    </span>

                    {selected && (
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-violet-400"
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* Navigation */}

        <div className="mt-5 flex justify-end">

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              disabled={
                selectedAnswer ===
                  null ||
                quizSubmitting
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                  Finish Quiz
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              disabled={
                selectedAnswer ===
                null
              }
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Question
              <ArrowRight size={17} />
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

/*
 * =========================================================
 * QUIZ RESULTS
 * =========================================================
 */

function QuizResults({
  result,
  quiz,
  onRestart,
  onExit,
}) {
  const percentage =
    result?.percentage ??
    result?.scorePercentage ??
    result?.score ??
    0;

  const score =
    result?.correctAnswers ??
    result?.correct ??
    result?.score ??
    0;

  const total =
    result?.totalQuestions ??
    quiz?.questions?.length ??
    0;

  const xp =
    result?.xpEarned ??
    result?.xp ??
    0;

  const level =
    result?.level ?? null;

  const streak =
    result?.streak ?? null;

  const achievements =
    result?.achievements || [];

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

      <div className="mx-auto w-full max-w-4xl p-5 sm:p-8">

        {/* Result hero */}

        <div className="overflow-hidden rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-7 text-center sm:p-10">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-2xl shadow-violet-500/20">
            <Trophy size={34} />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-violet-400">
            Quiz complete
          </p>

          <h2 className="mt-2 text-3xl font-black text-[var(--mentra-text)] sm:text-4xl">
            Great work!
          </h2>

          <p className="mt-2 text-sm text-[var(--mentra-text-muted)]">
            You scored{" "}
            <span className="font-bold text-[var(--mentra-text)]">
              {percentage}%
            </span>{" "}
            on {quiz.lessonTitle}.
          </p>

          {/* Stats */}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <ResultStat
              label="Score"
              value={`${score}/${total}`}
            />

            <ResultStat
              label="Percentage"
              value={`${percentage}%`}
            />

            <ResultStat
              label="XP earned"
              value={`+${xp}`}
            />

            <ResultStat
              label="Level"
              value={
                level !== null
                  ? level
                  : "—"
              }
            />

          </div>

          {streak !== null && (
            <div className="mt-3 rounded-2xl border border-amber-500/10 bg-amber-500/5 px-4 py-3 text-sm font-semibold text-amber-400">
              🔥 {streak} day streak
            </div>
          )}

        </div>

        {/* Achievements */}

        {achievements.length > 0 && (
          <div className="mt-5 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5">

            <div className="flex items-center gap-2">

              <Trophy
                size={18}
                className="text-amber-400"
              />

              <h3 className="font-bold text-[var(--mentra-text)]">
                Achievements unlocked
              </h3>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {achievements.map(
                (achievement, index) => (
                  <div
                    key={
                      achievement.id ||
                      achievement.name ||
                      index
                    }
                    className="rounded-xl border border-amber-500/10 bg-amber-500/5 px-3 py-2 text-xs font-bold text-amber-400"
                  >
                    {achievement.name ||
                      achievement.title ||
                      achievement}
                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* Actions */}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">

          <button
            type="button"
            onClick={onRestart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            <RotateCcw size={16} />
            Try Again
          </button>

          <button
            type="button"
            onClick={onExit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-3 text-sm font-bold text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
          >
            <MessageSquare size={16} />
            Back to Mentor
          </button>

        </div>

      </div>

    </div>
  );
}

function ResultStat({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4">

      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--mentra-text-subtle)]">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-[var(--mentra-text)]">
        {value}
      </p>

    </div>
  );
}