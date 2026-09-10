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
import { generateQuiz, submitQuiz } from "../../api/quiz.api";
import { getCurrentLesson } from "../../api/lesson.api";

const quickPrompts = [
{
label: "Explain a concept",
description: "Turn something difficult into something simple.",
prompt: "Explain a difficult concept to me in a simple way.",
icon: Lightbulb,
},
{
label: "Help with coding",
description: "Understand code, errors, and programming ideas.",
prompt: "Help me understand a programming problem.",
icon: Code2,
},
{
label: "Quiz me",
description: "Test what I know from my current lesson.",
icon: Brain,
action: "quiz",
},
{
label: "Study plan",
description: "Build a focused plan around my learning goals.",
prompt:
"Help me create a study plan for my current learning goals.",
icon: BookOpen,
},
];

const modes = [
{ id: "chat", label: "Chat", icon: MessageSquare },
{ id: "visual", label: "Visual", icon: ImageIcon },
{ id: "quiz", label: "Quiz", icon: Brain },
];

function getErrorMessage(error, fallback) {
return (
error?.response?.data?.message ||
error?.response?.data?.error ||
error?.message ||
fallback
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

/*

* QUIZ CONTRACT
*
* Backend questions:
*
* {
* id,
* question,
* optionA,
* optionB,
* optionC,
* optionD,
* correctAnswer
* }
*
* Answers submitted to backend are NUMBER values 1-4.
  */
  function getQuizOptions(question) {
  if (!question) return [];

const directOptions = [
question.optionA,
question.optionB,
question.optionC,
question.optionD,
];

if (
directOptions.some(
(value) => value !== undefined && value !== null
)
) {
return directOptions
.map((text, index) => ({
number: index + 1,
letter: String.fromCharCode(65 + index),
text: text == null ? "" : String(text),
}))
.filter((option) => option.text.trim().length > 0);
}

const raw =
question.options ??
question.answers ??
question.choices ??
question.answerOptions;

if (Array.isArray(raw)) {
return raw
.map((item, index) => {
if (typeof item === "string") {
return {
number: index + 1,
letter: String.fromCharCode(65 + index),
text: item,
};
}


    const text =
      item?.text ??
      item?.label ??
      item?.value ??
      item?.answer ??
      "";

    return {
      number: index + 1,
      letter: String.fromCharCode(65 + index),
      text: String(text),
    };
  })
  .filter((option) => option.text.trim().length > 0);


}

if (raw && typeof raw === "object") {
return Object.entries(raw)
.slice(0, 4)
.map(([key, value], index) => ({
number: index + 1,
letter:
key.length === 1
? key.toUpperCase()
: String.fromCharCode(65 + index),
text:
typeof value === "object"
? String(
value?.text ??
value?.label ??
value?.value ??
""
)
: String(value ?? ""),
}))
.filter((option) => option.text.trim().length > 0);
}

return [];
}

function normalizeQuestions(questions) {
if (!Array.isArray(questions)) return [];

return questions.map((question, index) => ({
...question,
id:
question?.id ??
question?.questionId ??
`question-${index + 1}`,
question:
question?.question ??
question?.text ??
question?.questionText ??
`Question ${index + 1}`,
}));
}

export default function Mentor() {
const { getToken } = useAuth();

const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const [isTyping, setIsTyping] = useState(false);
const [isGeneratingImage, setIsGeneratingImage] = useState(false);
const [activeMode, setActiveMode] = useState("chat");

const [quizMode, setQuizMode] = useState(false);
const [quizLoading, setQuizLoading] = useState(false);
const [quizError, setQuizError] = useState("");
const [quiz, setQuiz] = useState(null);
const [currentQuestionIndex, setCurrentQuestionIndex] =
useState(0);
const [answers, setAnswers] = useState([]);
const [selectedAnswer, setSelectedAnswer] = useState(null);
const [quizSubmitting, setQuizSubmitting] = useState(false);
const [quizResult, setQuizResult] = useState(null);

const textareaRef = useRef(null);
const messagesEndRef = useRef(null);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({
behavior: "smooth",
});
}, [messages, isTyping]);

const focusInput = () => {
window.setTimeout(() => {
textareaRef.current?.focus();
}, 50);
};

const sendMessage = async (messageText = input) => {
const text = String(messageText || "").trim();


if (!text || isTyping) return;

setMessages((current) => [
  ...current,
  {
    id: `user-${Date.now()}`,
    role: "user",
    content: text,
  },
]);

setInput("");
setIsTyping(true);

try {
  const response = await sendMentorMessage(
    text,
    getToken
  );

  setMessages((current) => [
    ...current,
    {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content:
        response?.answer ||
        response?.message ||
        response?.response ||
        "I couldn't generate a response.",
    },
  ]);
} catch (error) {
  console.error("❌ Mentor message error:", error);
  console.error(
    "❌ Backend response:",
    error?.response?.data
  );

  setMessages((current) => [
    ...current,
    {
      id: `error-${Date.now()}`,
      role: "assistant",
      isError: true,
      content: getErrorMessage(
        error,
        "Something went wrong while contacting your AI Mentor."
      ),
    },
  ]);
} finally {
  setIsTyping(false);
}


};

const generateVisual = async (promptText = input) => {
const prompt = String(promptText || "").trim();


if (!prompt || isGeneratingImage) return;

setMessages((current) => [
  ...current,
  {
    id: `user-image-${Date.now()}`,
    role: "user",
    content: prompt,
  },
]);

setInput("");
setIsGeneratingImage(true);

try {
  const response = await generateMentorImage(
    prompt,
    getToken
  );

  const image = response?.image;

  if (!image) {
    throw new Error(
      "The AI did not return an image."
    );
  }

  setMessages((current) => [
    ...current,
    {
      id: `assistant-image-${Date.now()}`,
      role: "assistant",
      type: "image",
      image: `data:${
        response?.mimeType || "image/png"
      };base64,${image}`,
    },
  ]);
} catch (error) {
  console.error("❌ Mentor image error:", error);

  setMessages((current) => [
    ...current,
    {
      id: `image-error-${Date.now()}`,
      role: "assistant",
      isError: true,
      content: getErrorMessage(
        error,
        "I couldn't generate that visual."
      ),
    },
  ]);
} finally {
  setIsGeneratingImage(false);
}


};

/*

* START QUIZ
*
* This function ONLY generates a new quiz.
* It is never called when submitting an existing quiz.
  */
  const startQuiz = async () => {
  if (quizLoading || quizSubmitting) return;


setQuizLoading(true);

setQuizError("");
setQuizResult(null);
setQuiz(null);
setAnswers([]);
setSelectedAnswer(null);
setCurrentQuestionIndex(0);
setQuizMode(true);
setActiveMode("quiz");

try {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "Authentication token was not generated."
    );
  }

  console.log("📚 Getting current lesson...");

  const lessonResponse = await getCurrentLesson(token);
  const lesson = getLessonFromResponse(
    lessonResponse
  );

  console.log(
    "📖 Current lesson:",
    lesson?.title,
    lesson?.id
  );

  if (!lesson?.id) {
    throw new Error(
      "Could not determine your current lesson."
    );
  }

  console.log(
    "🧠 Getting quiz for lesson:",
    lesson.id
  );

  const quizResponse = await generateQuiz(
    lesson.id,
    token
  );

  console.log(
    "🧠 RAW QUIZ RESPONSE:",
    quizResponse
  );

  const generatedQuiz =
    getQuizFromResponse(quizResponse);

  if (
    !generatedQuiz?.id ||
    !Array.isArray(generatedQuiz.questions) ||
    generatedQuiz.questions.length === 0
  ) {
    throw new Error(
      "No quiz questions were returned."
    );
  }

  const questions = normalizeQuestions(
    generatedQuiz.questions
  );

  console.log(
    "🧩 QUIZ QUESTIONS:",
    questions
  );

  console.log(
    "🧩 FIRST QUESTION OPTIONS:",
    questions[0]
      ? {
          optionA: questions[0].optionA,
          optionB: questions[0].optionB,
          optionC: questions[0].optionC,
          optionD: questions[0].optionD,
          options: questions[0].options,
        }
      : null
  );

  const usableQuestions = questions.filter(
    (question) =>
      getQuizOptions(question).length > 0
  );

  if (usableQuestions.length === 0) {
    throw new Error(
      "The quiz was generated, but no answer choices were found. The expected format is optionA, optionB, optionC and optionD."
    );
  }

  setQuiz({
    ...generatedQuiz,
    questions: usableQuestions,
    lessonTitle:
      lesson.title || "Current Lesson",
  });
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
    getErrorMessage(
      error,
      "Unable to start the quiz. Please try again."
    )
  );
} finally {
  setQuizLoading(false);
}


};

const selectAnswer = (number) => {
if (quizSubmitting) return;


setSelectedAnswer(number);


};

/*

* Save the answer currently selected.
*
* Returns the complete answer array so the final answer
* can be submitted immediately without waiting for React
* state to update.
  */
  const saveCurrentAnswer = () => {
  if (
  !quiz ||
  selectedAnswer === null
  ) {
  return null;
  }


const question =



  quiz.questions[currentQuestionIndex];

if (!question?.id) {
  return null;
}

const nextAnswers = [
  ...answers.filter(
    (item) =>
      item.questionId !== question.id
  ),
  {
    questionId: question.id,
    answer: selectedAnswer,
  },
];

setAnswers(nextAnswers);

return nextAnswers;


};

/*

* NEXT QUESTION
*
* This function is ONLY for moving between questions.
* It does NOT submit the quiz.
  */
  const handleNextQuestion = () => {
  if (!quiz || quizSubmitting) return;


const nextAnswers = saveCurrentAnswer();



if (!nextAnswers) return;

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

/*

* SUBMIT QUIZ
*
* This is the ONLY function responsible for finishing
* the quiz.
*
* IMPORTANT:
* It does NOT call startQuiz().
  */
  const handleSubmitQuiz = async () => {
  if (!quiz || quizSubmitting) return;


const finalAnswers = saveCurrentAnswer();



if (!finalAnswers) return;

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
    "📝 FINAL QUIZ SUBMISSION:",
    quiz.id,
    finalAnswers
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

  /*
   * Quiz is officially finished.
   *
   * Keep the completed quiz in state because the
   * results screen uses its questions.
   */
  setQuizResult(result);

  /*
   * Stop quiz mode.
   *
   * IMPORTANT:
   * We do NOT call startQuiz here.
   */
  setQuizMode(false);
  setActiveMode("chat");
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
    getErrorMessage(
      error,
      "Unable to submit the quiz."
    )
  );
} finally {
  setQuizSubmitting(false);
}


};

/*

* RETRY QUIZ
*
* Generate a completely fresh quiz.
  */
  const restartQuiz = () => {
  if (quizLoading || quizSubmitting) return;

setQuizResult(null);



setQuizError("");
setQuiz(null);
setCurrentQuestionIndex(0);
setAnswers([]);
setSelectedAnswer(null);
setQuizMode(true);
setActiveMode("quiz");

/*
 * startQuiz() is intentionally called here because
 * the user explicitly requested a new quiz.
 */
startQuiz();

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
focusInput();
};

const clearChat = () => {
setMessages([]);
setInput("");
focusInput();
};

const handleModeChange = (mode) => {
setActiveMode(mode);


if (mode === "quiz") {
  startQuiz();
  return;
}

setInput("");
focusInput();


};

const handleSubmit = (event) => {
event?.preventDefault?.();


if (activeMode === "visual") {
  generateVisual();
} else {
  sendMessage();
}


};

const handleKeyDown = (event) => {
if (
event.key === "Enter" &&
!event.shiftKey
) {
event.preventDefault();
handleSubmit(event);
}
};

const handleQuickPrompt = (item) => {
if (item.action === "quiz") {
startQuiz();
return;
}


sendMessage(item.prompt);

};

return ( <DashboardLayout> <div className="flex min-h-[calc(100vh-120px)] min-w-0 flex-col"> <section className="mb-5 rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 shadow-sm sm:p-5 lg:p-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div className="flex min-w-0 items-center gap-3 sm:gap-4"> <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20 sm:h-14 sm:w-14"> <Sparkles size={25} /> <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[var(--mentra-surface-2)] bg-emerald-400" /> </div>


          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-[var(--mentra-text)] sm:text-2xl lg:text-3xl">
                AI Mentor
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>

            <p className="mt-1 text-xs text-[var(--mentra-text-muted)] sm:text-sm">
              Your personal AI learning companion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-violet-500/10 bg-violet-500/5 px-3 py-2 text-xs font-bold text-violet-300 md:flex">
            <Zap size={14} />
            Context-aware learning
          </div>

          {messages.length > 0 && !quizMode && (
            <button
              type="button"
              onClick={clearChat}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3 py-2 text-xs font-bold text-[var(--mentra-text-muted)] transition hover:border-red-500/30 hover:text-red-400 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <Trash2 size={15} />
              <span className="hidden sm:inline">
                Clear chat
              </span>
            </button>
          )}

          {quizMode && (
            <button
              type="button"
              onClick={exitQuiz}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3 py-2 text-xs font-bold text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)] sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <ChevronLeft size={15} />
              Exit quiz
            </button>
          )}
        </div>
      </div>
    </section>

    {quizResult ? (
      <QuizResults
        result={quizResult}
        quiz={quiz}
        onRestart={restartQuiz}
        onExit={exitQuiz}
      />
    ) : quizMode ? (
      <QuizView
        quiz={quiz}
        loading={quizLoading}
        error={quizError}
        currentQuestionIndex={currentQuestionIndex}
        selectedAnswer={selectedAnswer}
        submitting={quizSubmitting}
        onSelectAnswer={selectAnswer}
        onNext={handleNextQuestion}
        onSubmit={handleSubmitQuiz}
        onRetry={startQuiz}
        onExit={exitQuiz}
      />
    ) : (
      <section className="flex min-h-[560px] min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] shadow-sm">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {messages.length === 0 ? (
              <WelcomeState
                onPrompt={handleQuickPrompt}
              />
            ) : (
              <div className="mx-auto w-full max-w-4xl space-y-5">
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
                  <ImageLoading />
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--mentra-border)] bg-[var(--mentra-surface)]/90 p-3 backdrop-blur-xl sm:p-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const active =
                  activeMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      handleModeChange(mode.id)
                    }
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition sm:px-3.5 ${
                      active
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] text-[var(--mentra-text-muted)] hover:border-violet-500/30 hover:text-[var(--mentra-text)]"
                    }`}
                  >
                    <Icon size={14} />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-2 transition focus-within:border-violet-500/40 focus-within:ring-2 focus-within:ring-violet-500/10">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={
                      isTyping ||
                      isGeneratingImage
                    }
                    placeholder={
                      activeMode === "visual"
                        ? "Describe the visual you want..."
                        : "Ask your AI Mentor anything..."
                    }
                    className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-[var(--mentra-text)] outline-none placeholder:text-[var(--mentra-text-muted)] disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={
                      !input.trim() ||
                      isTyping ||
                      isGeneratingImage
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {activeMode === "visual" ? (
                      <Wand2 size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-2 text-center text-[10px] text-[var(--mentra-text-muted)] sm:text-xs">
              Enter to send • Shift + Enter for a
              new line
            </p>
          </div>
        </div>
      </section>
    )}
  </div>
</DashboardLayout>


);
}

function WelcomeState({ onPrompt }) {
return ( <div className="mx-auto flex min-h-[520px] w-full max-w-4xl flex-col items-center justify-center py-8 text-center sm:py-12"> <div className="relative"> <div className="absolute inset-0 rounded-[30px] bg-violet-500/20 blur-3xl" />


    <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-2xl shadow-violet-500/20 sm:h-24 sm:w-24">
      <Sparkles size={34} />
    </div>
  </div>

  <div className="mt-7 flex items-center gap-2 rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-400">
    <GraduationCap size={13} />
    Mentra Intelligence
  </div>

  <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-[var(--mentra-text)] sm:text-4xl lg:text-5xl">
    Learn smarter with your AI Mentor.
  </h2>

  <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--mentra-text-muted)] sm:text-base">
    Ask questions, understand difficult concepts,
    get coding help, create visuals, or test your
    knowledge from your current lesson.
  </p>

  <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-2">
    {quickPrompts.map((item) => {
      const Icon = item.icon;

      return (
        <button
          key={item.label}
          type="button"
          onClick={() => onPrompt(item)}
          className="group rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-violet-500/5 hover:shadow-lg hover:shadow-violet-500/5 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/15">
              <Icon size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-black text-[var(--mentra-text)]">
                {item.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--mentra-text-muted)]">
                {item.description}
              </p>
            </div>

            <ArrowRight
              size={17}
              className="mt-1 shrink-0 text-[var(--mentra-text-muted)] transition group-hover:translate-x-1 group-hover:text-violet-400"
            />
          </div>
        </button>
      );
    })}
  </div>

  <div className="mt-7 flex flex-wrap justify-center gap-5 text-[10px] font-black uppercase tracking-wider text-[var(--mentra-text-muted)]">
    <span className="flex items-center gap-1.5">
      <Brain size={13} /> Context aware
    </span>

    <span className="flex items-center gap-1.5">
      <Zap size={13} /> Interactive
    </span>

    <span className="flex items-center gap-1.5">
      <Target size={13} /> Personalized
    </span>
  </div>
</div>


);
}

function Message({ message }) {
const isUser = message.role === "user";

return (
<div
className={`flex items-start gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
>
{!isUser && ( <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/10"> <Bot size={17} /> </div>
)}


  <div
    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[76%] ${
      isUser
        ? "rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10"
        : message.isError
          ? "rounded-bl-md border border-red-500/20 bg-red-500/5 text-red-400"
          : "rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] text-[var(--mentra-text)] shadow-sm"
    }`}
  >
    {message.type === "image" ? (
      <div className="overflow-hidden rounded-xl">
        <div className="relative">
          <img
            src={message.image}
            alt="AI generated visual"
            className="block max-h-[560px] w-full rounded-xl object-cover"
          />

          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
            <Sparkles size={11} />
            AI Visual
          </span>
        </div>
      </div>
    ) : (
      <div className="whitespace-pre-wrap break-words">
        {message.content}
      </div>
    )}
  </div>

  {isUser && (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--mentra-surface)] text-[var(--mentra-text-muted)]">
      <User size={17} />
    </div>
  )}
</div>


);
}

function TypingIndicator() {
return ( <div className="flex items-center gap-3"> <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white"> <Bot size={17} /> </div>


  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-3.5">
    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
  </div>
</div>


);
}

function ImageLoading() {
return ( <div className="flex items-center gap-3"> <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"> <Sparkles size={17} /> </div>


  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-3 text-xs font-bold text-[var(--mentra-text-muted)]">
    <Loader2
      size={14}
      className="animate-spin text-violet-400"
    />
    Creating your visual...
  </div>
</div>


);
}

function QuizView({
quiz,
loading,
error,
currentQuestionIndex,
selectedAnswer,
submitting,
onSelectAnswer,
onNext,
onSubmit,
onRetry,
onExit,
}) {
if (loading) {
return ( <div className="flex min-h-[620px] flex-1 items-center justify-center rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6"> <div className="w-full max-w-md text-center"> <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-violet-500/10 to-cyan-500/10"> <div className="absolute inset-0 animate-pulse rounded-[30px] bg-violet-500/10" />


        <Loader2
          size={34}
          className="relative animate-spin text-violet-400"
        />
      </div>

      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
        AI Quiz
      </p>

      <h2 className="mt-2 text-2xl font-black text-[var(--mentra-text)]">
        Preparing your challenge
      </h2>

      <p className="mt-3 text-sm leading-6 text-[var(--mentra-text-muted)]">
        Mentra is using your current lesson to
        build questions that test your
        understanding.
      </p>
    </div>
  </div>
);


}

if (error) {
return ( <div className="flex min-h-[620px] flex-1 items-center justify-center rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-5 sm:p-8"> <div className="w-full max-w-lg rounded-[28px] border border-red-500/20 bg-red-500/5 p-7 text-center sm:p-8"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"> <XCircle size={30} /> </div>


      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
        Quiz error
      </p>

      <h2 className="mt-2 text-2xl font-black text-[var(--mentra-text)]">
        We couldn't prepare your quiz
      </h2>

      <p className="mt-3 text-sm leading-6 text-red-400">
        {error}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
        >
          <RotateCcw size={16} />
          Try again
        </button>

        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] px-5 py-3 text-sm font-black text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
        >
          Back to Mentor
        </button>
      </div>
    </div>
  </div>
);

}

if (!quiz) return null;

const questions = quiz.questions || [];
const question =
questions[currentQuestionIndex];

if (!question) return null;

const options = getQuizOptions(question);
const number = currentQuestionIndex + 1;
const total = questions.length;
const progress = (number / total) * 100;
const isLast = number === total;

return ( <section className="flex min-h-[620px] flex-1 flex-col rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 sm:p-6 lg:p-8"> <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center"> <div className="mb-5 flex items-end justify-between gap-4"> <div className="min-w-0"> <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-violet-400"> <Brain size={15} />
Quiz Mode </div>


        <h2 className="mt-1 truncate text-lg font-black text-[var(--mentra-text)] sm:text-xl">
          {quiz.lessonTitle}
        </h2>
      </div>

      <div className="shrink-0 rounded-full border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-3 py-1.5 text-xs font-black text-[var(--mentra-text)] sm:px-4 sm:py-2 sm:text-sm">
        {number} / {total}
      </div>
    </div>

    <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--mentra-surface)]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>

    <div className="rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 shadow-xl shadow-black/5 sm:p-7 lg:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-black text-violet-400">
          {number}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-violet-400">
            Test your understanding
          </p>

          <h3 className="mt-2 text-xl font-black leading-8 text-[var(--mentra-text)] sm:text-2xl">
            {question.question}
          </h3>
        </div>
      </div>

      <div className="mt-7 grid gap-3">
        {options.map((option) => {
          const selected =
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
              disabled={submitting}
              className={`group flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all sm:gap-4 sm:p-4 ${
                selected
                  ? "border-violet-500/60 bg-violet-500/10 shadow-md shadow-violet-500/5"
                  : "border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-violet-500/5"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition ${
                  selected
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-[var(--mentra-border)] bg-[var(--mentra-surface)] text-[var(--mentra-text-muted)] group-hover:text-violet-400"
                }`}
              >
                {option.letter}
              </span>

              <span
                className={`flex-1 text-sm leading-6 ${
                  selected
                    ? "font-bold text-[var(--mentra-text)]"
                    : "font-medium text-[var(--mentra-text-muted)]"
                }`}
              >
                {option.text}
              </span>

              {selected && (
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-violet-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {options.length === 0 && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          This question has no readable answer
          choices.
        </div>
      )}

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-[var(--mentra-border)] pt-5">
        <p className="hidden text-[10px] font-bold uppercase tracking-wider text-[var(--mentra-text-muted)] sm:block">
          Select one answer
        </p>

        {/*
         * CRITICAL FIX:
         *
         * Last question -> onSubmit
         * Other questions -> onNext
         *
         * The displayed text and the executed function
         * now always match.
         */}
        <button
          type="button"
          onClick={
            isLast
              ? onSubmit
              : onNext
          }
          disabled={
            selectedAnswer === null ||
            submitting ||
            options.length === 0
          }
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Submitting...
            </>
          ) : isLast ? (
            <>
              <Trophy size={16} />
              Submit Quiz
            </>
          ) : (
            <>
              Next Question
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  </div>
</section>


);
}

function QuizResults({
result,
quiz,
onRestart,
onExit,
}) {
const percentage =
Number(result?.percentage ?? 0) || 0;

const score =
Number(result?.score ?? 0) || 0;

const total =
Number(
result?.totalQuestions ??
quiz?.questions?.length ??
0
) || 0;

const xpEarned =
Number(result?.xpEarned ?? 0) || 0;

const level = result?.level ?? 1;
const streak = result?.streak ?? 0;

const achievements =
result?.unlockedAchievements || [];

const review = result?.results || [];

const passed = percentage >= 70;

return ( <section className="flex min-h-[620px] flex-1 overflow-y-auto rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 sm:p-6 lg:p-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"> <div className="mx-auto w-full max-w-3xl"> <div className="rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 text-center shadow-xl shadow-black/5 sm:p-8"> <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-2xl shadow-violet-500/20"> <Trophy size={40} /> </div>


      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
        Quiz Complete
      </p>

      <h2 className="mt-2 text-5xl font-black tracking-tight text-[var(--mentra-text)]">
        {percentage}%
      </h2>

      <p className="mt-3 text-sm text-[var(--mentra-text-muted)]">
        {passed
          ? "Excellent work. You are building strong understanding."
          : "Good effort. Review the explanations and try again."}
      </p>

      <p className="mt-2 text-xs text-[var(--mentra-text-muted)]">
        {score} out of {total} questions
        correct.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ResultStat
          value={`+${xpEarned}`}
          label="XP Earned"
          icon={Zap}
        />

        <ResultStat
          value={level}
          label="Level"
          icon={GraduationCap}
        />

        <ResultStat
          value={`${streak} 🔥`}
          label="Streak"
          icon={Flame}
        />

        <ResultStat
          value={`${score}/${total}`}
          label="Score"
          icon={Target}
        />
      </div>
    </div>

    {achievements.length > 0 && (
      <div className="mt-4 rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Trophy size={18} />
          </div>

          <div>
            <h3 className="text-sm font-black text-[var(--mentra-text)]">
              Achievement unlocked
            </h3>

            <p className="text-xs text-[var(--mentra-text-muted)]">
              Keep learning to unlock more.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {achievements.map(
            (achievement, index) => (
              <div
                key={
                  achievement?.id ||
                  achievement?.name ||
                  index
                }
                className="rounded-xl bg-yellow-500/5 px-4 py-3 text-sm font-bold text-yellow-400"
              >
                {achievement?.name ||
                  achievement?.title ||
                  "New Achievement"}
              </div>
            )
          )}
        </div>
      </div>
    )}

    {review.length > 0 && (
      <div className="mt-4 rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-5 sm:p-6">
        <h3 className="text-lg font-black text-[var(--mentra-text)]">
          Review your answers
        </h3>

        <div className="mt-5 space-y-3">
          {review.map((item, index) => (
            <div
              key={
                item?.questionId ||
                index
              }
              className={`rounded-2xl border p-4 ${
                item?.isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {item?.isCorrect ? (
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                ) : (
                  <XCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-400"
                  />
                )}

                <div className="min-w-0">
                  <p className="text-sm font-bold leading-6 text-[var(--mentra-text)]">
                    {index + 1}.{" "}
                    {item?.question}
                  </p>

                  <p className="mt-2 text-xs text-[var(--mentra-text-muted)]">
                    Your answer:{" "}
                    {getReviewAnswer(
                      item
                    )}
                  </p>

                  {!item?.isCorrect && (
                    <p className="mt-1 text-xs text-emerald-400">
                      Correct answer:{" "}
                      {getReviewCorrectAnswer(
                        item
                      )}
                    </p>
                  )}

                  {item?.explanation && (
                    <p className="mt-3 border-t border-[var(--mentra-border)] pt-3 text-xs leading-5 text-[var(--mentra-text-muted)]">
                      <strong className="text-[var(--mentra-text)]">
                        Why:
                      </strong>{" "}
                      {item.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onRestart}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
      >
        <RotateCcw size={17} />
        Try Again
      </button>

      <button
        type="button"
        onClick={onExit}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-6 py-3 text-sm font-black text-[var(--mentra-text-muted)] transition hover:text-[var(--mentra-text)]"
      >
        <MessageSquare size={17} />
        Back to Mentor
      </button>
    </div>
  </div>
</section>


);
}

function ResultStat({
value,
label,
icon: Icon,
}) {
return ( <div className="rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 text-left"> <div className="flex items-center justify-between gap-2"> <p className="text-xl font-black text-[var(--mentra-text)]">
{value} </p>


    <Icon
      size={15}
      className="text-violet-400"
    />
  </div>

  <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[var(--mentra-text-muted)]">
    {label}
  </p>
</div>

);
}

function getReviewAnswer(item) {
const answers = {
1: item?.optionA,
2: item?.optionB,
3: item?.optionC,
4: item?.optionD,
};

return (
answers[item?.selectedAnswer] ||
"Not answered"
);
}

function getReviewCorrectAnswer(item) {
const answers = {
1: item?.optionA,
2: item?.optionB,
3: item?.optionC,
4: item?.optionD,
};

return (
answers[item?.correctAnswer] ||
"Unknown"
);
}
