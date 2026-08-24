import { useParams } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { useLesson } from "../../hooks/useLesson";
import { useCompleteLesson } from "../../hooks/useCompleteLesson";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMentor } from "../../hooks/useMentor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useBookmarks } from "../../hooks/useBookmarks";
import { Bookmark } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Lesson() {
  const { id } = useParams();
console.log("Lesson URL id:", id);
  const {
    data,
    isLoading,
    error,
  } = useLesson(id);

  const navigate = useNavigate();
  const {
  bookmarks,
  addBookmark,
  removeBookmark,
  isAdding,
  deletingId,
} = useBookmarks();
  const [showMentor, setShowMentor] = useState(false);
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);
  const mentorMutation = useMentor();

const completeMutation =
  useCompleteLesson();

  const lesson = data?.lesson;

  const content = lesson?.content;

  const isBookmarked = bookmarks.some(
  (bookmark) =>
    bookmark.lessonId === lesson?.id
);
  console.log(data)

  async function handleComplete() {
  completeMutation.mutate(id, {
    onSuccess: (response) => {
      console.log("✅ Lesson completed:", response);

      const nextLessonId = response?.nextLesson?.id;

      if (nextLessonId) {
        console.log("➡️ Loading next lesson:", nextLessonId);

        navigate(`/lessons/${nextLessonId}`);
        return;
      }

      console.log("🎉 Roadmap completed!");
      navigate("/dashboard");
    },

    onError: (error) => {
      console.error("❌ Failed to complete lesson:", error);
    },
  });
}
async function askMentor() {

  if (!question.trim()) return;

  const userMessage = {
    role: "user",
    text: question,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  mentorMutation.mutate(
    {
      lessonId: lesson.id,
      question,
    },
    {
      onSuccess: (data) => {

        setMessages((prev) => [

          ...prev,

          {
            role: "assistant",
            text: data.answer,
          },

        ]);

      },
    }
  );

  setQuestion("");
}

  if (isLoading) {
    return (
      <DashboardLayout>
        Loading lesson...
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        Failed to load lesson.
      </DashboardLayout>
    );
  }


  return (

    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl px-6">

        {/* Header */}

        <div className="mb-8">

          <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
           {lesson?.module?.title}
          </span>

          <h1 className="mt-4 text-4xl font-black text-white">
          {lesson?.title}
          </h1>

          <p className="mt-3 text-lg text-slate-400">
            {lesson?.description}
          </p>

        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* Main Content */}

        <div className="space-y-8">

  <div>

    <h3 className="mb-3 text-xl font-bold text-white">
      📖 Notes
    </h3>

    <p className="whitespace-pre-wrap leading-8 text-slate-300">
      {content?.notes}
    </p>

  </div>

  <div>

    <h3 className="mb-3 text-xl font-bold text-white">
      💻 Code Example
    </h3>

    <pre className="overflow-auto rounded-xl bg-[#09090B] p-5 text-sm text-emerald-300">

      {content?.codeExample}

    </pre>

  </div>

  <div>

    <h3 className="mb-3 text-xl font-bold text-white">
      📝 Exercise
    </h3>

    <p className="whitespace-pre-wrap leading-8 text-slate-300">

      {content?.exercise}

    </p>

  </div>

  <div>

    <h3 className="mb-3 text-xl font-bold text-white">
      📌 Summary
    </h3>

    <p className="whitespace-pre-wrap leading-8 text-slate-300">

      {content?.summary}

    </p>

  </div>

</div>

          {/* Sidebar */}

         <div className="sticky top-6 h-fit space-y-6">

            <div className="rounded-3xl border border-white/10 bg-[#18181B] p-6">

              <h3 className="text-xl font-bold text-white">
                Lesson Progress
              </h3>

              <div className="mt-6 h-3 rounded-full bg-[#2A2A2A]">

               <div
  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
  style={{
    width: `${
      ((data?.progress?.current || 0) /
        (data?.progress?.total || 1)) *
      100
    }%`,
  }}
/>

              </div>

              <p className="mt-4 text-sm text-slate-400">
  Lesson {data?.progress?.current} of {data?.progress?.total}
</p>

            </div>

          <button
  onClick={() => setShowMentor(true)}
  className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 py-4 font-bold text-white transition hover:scale-105"
>
  🤖 Ask AI Mentor
</button>

<button
  onClick={() =>
    isBookmarked
      ? removeBookmark(lesson.id)
      : addBookmark(lesson.id)
  }
  disabled={isAdding || deletingId === lesson.id}
  className={`w-full rounded-2xl py-4 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
    isBookmarked
      ? "border border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
      : "border border-white/10 text-white hover:bg-white/5"
  }`}
>
  {isAdding || deletingId === lesson.id ? (
    <span className="flex items-center justify-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {isBookmarked
        ? "Removing..."
        : "Saving..."}
    </span>
  ) : (
    <span className="flex items-center justify-center gap-2">
      <Bookmark
        size={18}
        fill={isBookmarked ? "currentColor" : "none"}
      />

      {isBookmarked
        ? "Bookmarked"
        : "Bookmark Lesson"}
    </span>
  )}
</button>

  <button
  onClick={handleComplete}

  disabled={completeMutation.isPending}

  className="w-full rounded-2xl bg-emerald-500 py-4 font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
>

  {completeMutation.isPending

    ? "Completing..."

    : "✓ Mark Complete"}

</button>
<button
  onClick={() => navigate(`/quiz/${lesson.id}`)}
  className="w-full rounded-2xl bg-cyan-600 py-4 font-bold text-white transition hover:bg-cyan-700"
>
  📝 Take Quiz
</button>

          <button
  onClick={handleComplete}
  disabled={completeMutation.isPending}
  className="w-full rounded-2xl border border-white/10 py-4 font-bold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
>
  {completeMutation.isPending
    ? "Loading next lesson..."
    : "Next Lesson →"}
</button>

          </div>

        </div>

      </div>

      {showMentor && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

    <div className="flex h-[80vh] w-[900px] flex-col rounded-3xl border border-white/10 bg-[#18181B]">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 p-6">

        <div>

          <h2 className="text-2xl font-bold text-white">
            🤖 Mentra AI Mentor
          </h2>

          <p className="text-slate-400">
            Ask anything about this lesson
          </p>

        </div>

        <button
          onClick={() => setShowMentor(false)}
          className="text-2xl text-slate-400 hover:text-white"
        >
          ×
        </button>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-6">

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

  {messages.length === 0 ? (

    <div className="mt-24 text-center">

      <h3 className="text-3xl font-bold text-white">
        👋 Hi!
      </h3>

      <p className="mt-4 text-slate-400">
        Ask me anything about this lesson.
      </p>

    </div>

  ) : (

    messages.map((message, index) => (

      <div
        key={index}
        className={`flex ${
          message.role === "user"
            ? "justify-end"
            : "justify-start"
        }`}
      >

        <div
          className={`max-w-[80%] rounded-2xl px-5 py-4 whitespace-pre-wrap ${
            message.role === "user"
              ? "bg-violet-600 text-white"
              : "bg-[#232326] text-slate-200"
          }`}
        >

          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({
      inline,
      className,
      children,
      ...props
    }) {

      const match =
        /language-(\w+)/.exec(
          className || ""
        );

      return !inline && match ? (

        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >

          {String(children).replace(/\n$/, "")}

        </SyntaxHighlighter>

      ) : (

        <code
          className="rounded bg-[#09090B] px-1 py-0.5"
          {...props}
        >

          {children}

        </code>

      );

    },
  }}
>

  {message.text}

</ReactMarkdown>

        </div>

      </div>

    ))



  )}



</div>
{mentorMutation.isPending && (

  <div className="flex justify-start">

    <div className="rounded-2xl bg-[#232326] px-5 py-4 text-slate-400 animate-pulse">

      Mentra is thinking...

    </div>

  </div>

)}

      </div>

      {/* Input */}

      <div className="border-t border-white/10 p-6">

        <div className="flex gap-4">

          <input
            value={question}
            disabled={mentorMutation.isPending}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askMentor();
              }
            }}
            placeholder="Ask your mentor..."
            className="flex-1 rounded-xl bg-[#232326] px-5 py-4 text-white outline-none"
          />

         <button
  onClick={askMentor}
  disabled={mentorMutation.isPending}
  className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-8 font-bold text-white disabled:opacity-50"
>

  {mentorMutation.isPending
    ? "..."
    : "Send"}

</button>

        </div>

      </div>

    </div>

  </div>
)}
    </DashboardLayout>
  );
}