import { useCallback, useEffect, useRef, useState } from "react";
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
  Flame,
  Target,
  ChevronLeft,
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

/* =========================================================
   QUICK PROMPTS
========================================================= */

const QUICK_PROMPTS = [
  {
    icon: Lightbulb,
    title: "Explain a concept",
    prompt: "Explain a difficult programming concept to me in simple terms.",
  },
  {
    icon: Code2,
    title: "Help with coding",
    prompt: "Help me understand how to solve a coding problem.",
  },
  {
    icon: Brain,
    title: "Quiz me",
    prompt: "Quiz me on what I am currently learning.",
  },
  {
    icon: BookOpen,
    title: "Study plan",
    prompt: "Create a simple study plan for me.",
  },
];

/* =========================================================
   MODES
========================================================= */

const MODES = [
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
    icon: GraduationCap,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getApiError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function getLessonFromResponse(response) {
  return (
    response?.lesson ||
    response?.data?.lesson ||
    response?.data ||
    response
  );
}

function getQuizFromResponse(response) {
  return (
    response?.quiz ||
    response?.data?.quiz ||
    response?.data ||
    response
  );
}

function getQuizOptions(question) {
  if (!question) return [];

  if (
    question.optionA !== undefined ||
    question.optionB !== undefined ||
    question.optionC !== undefined ||
    question.optionD !== undefined
  ) {
    return [
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ].filter(
      (option) =>
        option !== undefined &&
        option !== null &&
        String(option).trim() !== ""
    );
  }

  if (Array.isArray(question.options)) {
    return question.options.map((option) => {
      if (
        typeof option === "object" &&
        option !== null
      ) {
        return (
          option.text ||
          option.label ||
          option.value ||
          ""
        );
      }

      return option;
    });
  }

  return [];
}

function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) return [];

  return questions.map((question, index) => ({
    ...question,
    id:
      question.id ||
      question.questionId ||
      `question-${index + 1}`,
    question:
      question.question ||
      question.text ||
      question.prompt ||
      `Question ${index + 1}`,
    options: getQuizOptions(question),
  }));
}

/* =========================================================
   MENTOR
========================================================= */

export default function Mentor() {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [authReady, setAuthReady] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [activeMode, setActiveMode] = useState("chat");

  const [quizMode, setQuizMode] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [quizResult, setQuizResult] = useState(null);
  const [quizError, setQuizError] = useState(null);

  const [error, setError] = useState(null);

  const textareaRef = useRef(null);

  /* =======================================================
     WAIT FOR CLERK
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function prepareAuthentication() {
      /*
       * Clerk itself is still loading.
       */
      if (!isLoaded) {
        setAuthReady(false);
        return;
      }

      /*
       * Clerk finished loading but user is not signed in.
       */
      if (!isSignedIn) {
        setAuthToken(null);
        setAuthReady(false);
        return;
      }

      /*
       * Clerk says the user is signed in.
       * Now actually obtain the token before showing Mentor.
       */
      try {
        console.log("🔐 MENTOR: Clerk loaded.");
        console.log("🔐 MENTOR: User is signed in.");
        console.log("🔐 MENTOR: Getting session token...");

        const token = await getToken();

        if (cancelled) return;

        if (!token) {
          console.error(
            "❌ MENTOR: Clerk returned no token."
          );

          setAuthToken(null);
          setAuthReady(false);
          return;
        }

        console.log(
          "✅ MENTOR: Authentication token ready."
        );

        setAuthToken(token);
        setAuthReady(true);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "❌ MENTOR: Failed to get Clerk token:",
          error
        );

        setAuthToken(null);
        setAuthReady(false);
      }
    }

    prepareAuthentication();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  /* =======================================================
     AUTH TOKEN HELPER
  ======================================================= */

  const getAuthToken = useCallback(async () => {
    if (!isLoaded) {
      throw new Error(
        "Clerk is still loading."
      );
    }

    if (!isSignedIn) {
      throw new Error(
        "Your Mentra session is not signed in."
      );
    }

    if (!authToken) {
      throw new Error(
        "Mentra authentication is still loading."
      );
    }

    return authToken;
  }, [
    isLoaded,
    isSignedIn,
    authToken,
  ]);

  /* =======================================================
     AUTH STATE LOG
  ======================================================= */

  useEffect(() => {
    console.log("🔐 MENTOR AUTH STATE:", {
      isLoaded,
      isSignedIn,
      tokenReady: !!authToken,
      authReady,
    });
  }, [
    isLoaded,
    isSignedIn,
    authToken,
    authReady,
  ]);

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = useCallback(
    async (messageText = input) => {
      const text = messageText.trim();

      if (!text || typing) return;

      if (!authReady || !authToken) {
        setError(
          "Mentor is still preparing your secure session. Please wait a moment."
        );
        return;
      }

      setError(null);
      setInput("");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "user",
          content: text,
        },
      ]);

      setTyping(true);

      try {
        const token = await getAuthToken();

        const response = await sendMentorMessage(
          text,
          async () => token
        );

        const answer =
          response?.message ||
          response?.answer ||
          response?.response ||
          response?.data?.message ||
          response?.data?.answer ||
          "I received your message.";

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: answer,
          },
        ]);
      } catch (err) {
        console.error(
          "❌ Mentor chat error:",
          err
        );

        setError(getApiError(err));
      } finally {
        setTyping(false);
      }
    },
    [
      input,
      typing,
      authReady,
      authToken,
      getAuthToken,
    ]
  );

  /* =======================================================
     GENERATE VISUAL
  ======================================================= */

  const generateVisual = useCallback(
    async (prompt = input) => {
      const text = prompt.trim();

      if (!text || imageLoading) return;

      if (!authReady || !authToken) {
        setError(
          "Mentor is still preparing your secure session."
        );
        return;
      }

      setError(null);
      setImageLoading(true);
      setInput("");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "user",
          content: text,
        },
      ]);

      try {
        const token = await getAuthToken();

        const response =
          await generateMentorImage(
            text,
            async () => token
          );

        const imageUrl =
          response?.imageUrl ||
          response?.image ||
          response?.url ||
          response?.data?.imageUrl ||
          response?.data?.image;

        if (!imageUrl) {
          throw new Error(
            "The mentor did not return an image."
          );
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            type: "image",
            content: imageUrl,
          },
        ]);
      } catch (err) {
        console.error(
          "❌ Mentor image error:",
          err
        );

        setError(getApiError(err));
      } finally {
        setImageLoading(false);
      }
    },
    [
      input,
      imageLoading,
      authReady,
      authToken,
      getAuthToken,
    ]
  );

  /* =======================================================
     START QUIZ
  ======================================================= */

  const startQuiz = useCallback(
    async () => {
      if (quizLoading || quizSubmitting) return;

      if (!authReady || !authToken) {
        setQuizError(
          "Mentor is still preparing your secure session."
        );
        return;
      }

      setQuizLoading(true);
      setQuizError(null);
      setQuizResult(null);
      setQuiz(null);
      setAnswers([]);
      setSelectedAnswer(null);
      setCurrentQuestion(0);
      setQuizMode(true);
      setActiveMode("quiz");

      try {
        const token = await getAuthToken();

        console.log(
          "🧠 QUIZ: Getting current lesson..."
        );

        const lessonResponse =
          await getCurrentLesson(token);

        const lesson =
          getLessonFromResponse(
            lessonResponse
          );

        if (!lesson?.id) {
          throw new Error(
            "No current lesson was found."
          );
        }

        console.log(
          "🧠 QUIZ: Generating quiz for lesson:",
          lesson.id
        );

        const quizResponse =
          await generateQuiz(
            lesson.id,
            token
          );

        const generatedQuiz =
          getQuizFromResponse(
            quizResponse
          );

        if (!generatedQuiz) {
          throw new Error(
            "Quiz generation returned no quiz."
          );
        }

        const normalizedQuestions =
          normalizeQuestions(
            generatedQuiz.questions
          );

        const usableQuestions =
          normalizedQuestions.filter(
            (question) =>
              question.options.length > 0
          );

        if (!usableQuestions.length) {
          throw new Error(
            "The generated quiz contains no usable questions."
          );
        }

        setQuiz({
          ...generatedQuiz,
          questions: usableQuestions,
          lessonTitle:
            lesson.title ||
            "Current Lesson",
        });

        console.log(
          "✅ QUIZ: Quiz ready."
        );
      } catch (err) {
        console.error(
          "❌ QUIZ START ERROR:",
          err
        );

        setQuizError(
          getApiError(err)
        );
      } finally {
        setQuizLoading(false);
      }
    },
    [
      quizLoading,
      quizSubmitting,
      authReady,
      authToken,
      getAuthToken,
    ]
  );

  /* =======================================================
     SAVE CURRENT ANSWER
  ======================================================= */

  const saveCurrentAnswer =
    useCallback(() => {
      if (selectedAnswer === null) {
        return answers;
      }

      const question =
        quiz?.questions?.[
          currentQuestion
        ];

      if (!question) {
        return answers;
      }

      const nextAnswers = [
        ...answers.filter(
          (answer) =>
            answer.questionId !==
            question.id
        ),
        {
          questionId: question.id,
          answer: selectedAnswer,
        },
      ];

      setAnswers(nextAnswers);

      return nextAnswers;
    }, [
      selectedAnswer,
      answers,
      quiz,
      currentQuestion,
    ]);

  /* =======================================================
     NEXT QUESTION
  ======================================================= */

  const handleNextQuestion =
    useCallback(() => {
      const nextAnswers =
        saveCurrentAnswer();

      setAnswers(nextAnswers);

      if (
        !quiz?.questions ||
        currentQuestion >=
          quiz.questions.length - 1
      ) {
        return;
      }

      setCurrentQuestion(
        (prev) => prev + 1
      );

      setSelectedAnswer(null);
    }, [
      saveCurrentAnswer,
      quiz,
      currentQuestion,
    ]);

  /* =======================================================
     SUBMIT QUIZ
  ======================================================= */

  const handleSubmitQuiz =
    useCallback(async () => {
      if (
        quizSubmitting ||
        !quiz?.id
      ) {
        return;
      }

      if (!authReady || !authToken) {
        setQuizError(
          "Your secure session is still loading."
        );
        return;
      }

      const finalAnswers =
        saveCurrentAnswer();

      setQuizSubmitting(true);
      setQuizError(null);

      try {
        const token =
          await getAuthToken();

        console.log(
          "🧠 QUIZ: Submitting answers..."
        );

        const response =
          await submitQuiz(
            quiz.id,
            finalAnswers,
            token
          );

        const result =
          response?.result ||
          response?.data?.result ||
          response?.data ||
          response;

        setQuizResult(result);

        setQuizMode(false);
        setActiveMode("chat");
      } catch (err) {
        console.error(
          "❌ QUIZ SUBMIT ERROR:",
          err
        );

        setQuizError(
          getApiError(err)
        );
      } finally {
        setQuizSubmitting(false);
      }
    }, [
      quizSubmitting,
      quiz,
      authReady,
      authToken,
      saveCurrentAnswer,
      getAuthToken,
    ]);

  /* =======================================================
     RESTART QUIZ
  ======================================================= */

  const restartQuiz =
    useCallback(() => {
      setQuizResult(null);
      setQuiz(null);
      setAnswers([]);
      setSelectedAnswer(null);
      setCurrentQuestion(0);
      setQuizError(null);

      setQuizMode(true);
      setActiveMode("quiz");

      startQuiz();
    }, [startQuiz]);

  /* =======================================================
     EXIT QUIZ
  ======================================================= */

  const exitQuiz = useCallback(() => {
    setQuizMode(false);
    setQuiz(null);
    setQuizResult(null);
    setAnswers([]);
    setSelectedAnswer(null);
    setCurrentQuestion(0);
    setQuizError(null);
    setActiveMode("chat");
  }, []);

  /* =======================================================
     MODE CHANGE
  ======================================================= */

  const handleModeChange =
    useCallback(
      (mode) => {
        if (!authReady) return;

        setActiveMode(mode);

        if (mode === "quiz") {
          startQuiz();
          return;
        }

        setQuizMode(false);
        setInput("");

        setTimeout(() => {
          textareaRef.current?.focus();
        }, 50);
      },
      [authReady, startQuiz]
    );

  /* =======================================================
     CLEAR CHAT
  ======================================================= */

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  /* =======================================================
     QUICK PROMPT
  ======================================================= */

  const handleQuickPrompt = (
    prompt,
    mode = "chat"
  ) => {
    if (!authReady) return;

    if (mode === "quiz") {
      startQuiz();
      return;
    }

    setInput(prompt);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (!isLoaded || !authReady) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Preparing AI Mentor
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {!isLoaded
                ? "Waiting for your secure Mentra session to finish loading..."
                : !isSignedIn
                ? "Waiting for your Mentra account session..."
                : "Securing your Mentor session and getting your authentication token..."}
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
              <Sparkles className="h-4 w-4" />
              <span>
                Your Mentor will be ready in a moment
              </span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     SIGNED OUT
  ======================================================= */

  if (!isSignedIn || !authToken) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
              <User className="h-10 w-10 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Session Required
            </h1>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Please sign in again to use AI Mentor.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-80px)] flex-col">
        {/* HEADER */}

        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>

              <div>
                <h1 className="font-semibold text-zinc-900 dark:text-white">
                  AI Mentor
                </h1>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Online
                </div>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
          {quizMode ? (
            <QuizView
              quiz={quiz}
              loading={quizLoading}
              error={quizError}
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={
                setSelectedAnswer
              }
              onNext={handleNextQuestion}
              onSubmit={handleSubmitQuiz}
              onExit={exitQuiz}
              submitting={quizSubmitting}
            />
          ) : quizResult ? (
            <QuizResults
              result={quizResult}
              onRestart={restartQuiz}
              onBack={exitQuiz}
            />
          ) : (
            <div className="flex flex-1 flex-col">
              {/* MESSAGES */}

              <div className="flex-1 space-y-5 py-6">
                {messages.length === 0 ? (
                  <WelcomeState
                    onPrompt={handleQuickPrompt}
                  />
                ) : (
                  messages.map((message) => (
                    <Message
                      key={message.id}
                      message={message}
                    />
                  ))
                )}

                {typing && (
                  <TypingIndicator />
                )}

                {imageLoading && (
                  <ImageLoading />
                )}
              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* INPUT */}

              <div className="sticky bottom-0 pb-5 pt-3">
                <div className="rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) =>
                        setInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey
                        ) {
                          e.preventDefault();

                          if (
                            activeMode ===
                            "visual"
                          ) {
                            generateVisual();
                          } else {
                            sendMessage();
                          }
                        }
                      }}
                      placeholder={
                        activeMode === "visual"
                          ? "Describe what you want me to visualize..."
                          : "Ask your AI Mentor anything..."
                      }
                      rows={1}
                      className="min-h-[46px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
                    />

                    <button
                      onClick={() =>
                        activeMode ===
                        "visual"
                          ? generateVisual()
                          : sendMessage()
                      }
                      disabled={
                        !input.trim() ||
                        typing ||
                        imageLoading ||
                        !authReady
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {typing ||
                      imageLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-1 px-1">
                    {MODES.map(
                      ({
                        id,
                        label,
                        icon: Icon,
                      }) => (
                        <button
                          key={id}
                          onClick={() =>
                            handleModeChange(
                              id
                            )
                          }
                          disabled={!authReady}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                            activeMode === id
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   WELCOME
========================================================= */

function WelcomeState({ onPrompt }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10">
        <Bot className="h-10 w-10 text-emerald-500" />
      </div>

      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
        How can I help you learn?
      </h2>

      <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        Ask questions, get coding help, create study
        plans, generate visuals, or test your knowledge
        with a quiz.
      </p>

      <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_PROMPTS.map(
          ({
            icon: Icon,
            title,
            prompt,
          }) => (
            <button
              key={title}
              onClick={() =>
                onPrompt(
                  prompt,
                  title === "Quiz me"
                    ? "quiz"
                    : "chat"
                )
              }
              className="group rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-emerald-500/40 hover:bg-emerald-500/5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <Icon className="h-5 w-5 text-emerald-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {title}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Try this with Mentor
                  </p>
                </div>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({ message }) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <Bot className="h-4 w-4 text-emerald-500" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-emerald-500 text-white"
            : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        }`}
      >
        {message.type === "image" ? (
          <img
            src={message.content}
            alt="Mentor generated visual"
            className="max-w-full rounded-xl"
          />
        ) : (
          message.content
        )}
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <User className="h-4 w-4 text-zinc-500" />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TYPING
========================================================= */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
        <Bot className="h-4 w-4 text-emerald-500" />
      </div>

      <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   IMAGE LOADING
========================================================= */

function ImageLoading() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
        <Wand2 className="h-4 w-4 text-emerald-500" />
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-500 dark:bg-zinc-900">
        <Loader2 className="h-4 w-4 animate-spin" />
        Generating visual...
      </div>
    </div>
  );
}

/* =========================================================
   QUIZ VIEW
========================================================= */

function QuizView({
  quiz,
  loading,
  error,
  currentQuestion,
  selectedAnswer,
  setSelectedAnswer,
  onNext,
  onSubmit,
  onExit,
  submitting,
}) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-500" />

          <h2 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
            Preparing your quiz
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Getting your current lesson and generating
            questions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
            Quiz could not be loaded
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error}
          </p>

          <button
            onClick={onExit}
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Mentor
          </button>
        </div>
      </div>
    );
  }

  if (!quiz?.questions?.length) {
    return null;
  }

  const question =
    quiz.questions[currentQuestion];

  const isLast =
    currentQuestion ===
    quiz.questions.length - 1;

  const progress =
    ((currentQuestion + 1) /
      quiz.questions.length) *
    100;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-8">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Exit quiz
        </button>

        <span className="text-sm font-medium text-zinc-500">
          {currentQuestion + 1} /{" "}
          {quiz.questions.length}
        </span>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
          <span>
            {quiz.lessonTitle}
          </span>

          <span>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
          Question {currentQuestion + 1}
        </p>

        <h2 className="mt-4 text-xl font-bold leading-8 text-zinc-900 dark:text-white sm:text-2xl">
          {question.question}
        </h2>

        <div className="mt-7 space-y-3">
          {question.options.map(
            (option, index) => {
              const optionNumber =
                index + 1;

              const selected =
                selectedAnswer ===
                optionNumber;

              return (
                <button
                  key={optionNumber}
                  onClick={() =>
                    setSelectedAnswer(
                      optionNumber
                    )
                  }
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-200 hover:border-emerald-500/40 dark:border-zinc-800 dark:hover:border-emerald-500/40"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                      selected
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                    }`}
                  >
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {option}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={
            isLast
              ? onSubmit
              : onNext
          }
          disabled={
            selectedAnswer === null ||
            submitting
          }
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isLast ? (
            <>
              Submit Quiz
              <CheckCircle2 className="h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   QUIZ RESULTS
========================================================= */

function QuizResults({
  result,
  onRestart,
  onBack,
}) {
  const score =
    result?.score ??
    result?.correct ??
    0;

  const total =
    result?.total ??
    result?.totalQuestions ??
    0;

  const percentage =
    result?.percentage ??
    (total
      ? Math.round(
          (score / total) * 100
        )
      : 0);

  const xp =
    result?.xpEarned ??
    result?.xp ??
    0;

  const level =
    result?.level ??
    1;

  const streak =
    result?.streak ??
    0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center py-10">
      <div className="w-full text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10">
          <Trophy className="h-10 w-10 text-emerald-500" />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
          Quiz Complete!
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Great work. Here's how you did.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultCard
            icon={Target}
            label="Score"
            value={`${score}/${total}`}
          />

          <ResultCard
            icon={Trophy}
            label="Percentage"
            value={`${percentage}%`}
          />

          <ResultCard
            icon={Zap}
            label="XP"
            value={`+${xp}`}
          />

          <ResultCard
            icon={Flame}
            label="Streak"
            value={streak}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">
            Current Level
          </p>

          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
            Level {level}
          </p>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={onBack}
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
          >
            Back to Mentor
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RESULT CARD
========================================================= */

function ResultCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <Icon className="mx-auto h-5 w-5 text-emerald-500" />

      <p className="mt-2 text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}