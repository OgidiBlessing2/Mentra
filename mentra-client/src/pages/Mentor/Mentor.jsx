
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
} from "lucide-react";

import { useAuth } from "@clerk/clerk-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { sendMentorMessage } from "../../api/global-mentor.api";

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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (!text || isTyping) {
      return;
    }

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
      /*
       * IMPORTANT:
       * sendMentorMessage() already calls getToken().
       *
       * Therefore we pass getToken itself,
       * NOT an already-generated token.
       */
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

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-120px)] min-w-0 flex-col">

        {/* Header */}

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

          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-2.5 text-sm font-medium text-[var(--mentra-text-muted)] transition hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
            >
              <Trash2 size={16} />
              Clear chat
            </button>
          )}

        </section>

        {/* Chat */}

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)]">

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

            {messages.length === 0 ? (

              <WelcomeState
                onPrompt={sendMessage}
              />

            ) : (

              <div className="mx-auto w-full max-w-4xl space-y-6">

                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                  />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />

              </div>

            )}

          </div>

          {/* Input */}

          <div className="border-t border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4 sm:p-5">

            <form
              onSubmit={handleSubmit}
              className="mx-auto w-full max-w-4xl"
            >

              <div className="relative overflow-hidden rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] transition focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/10">

                <textarea
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI Mentor anything..."
                  rows={1}
                  disabled={isTyping}
                  className="block min-h-[56px] w-full resize-none bg-transparent px-5 py-4 pr-16 text-sm text-[var(--mentra-text)] outline-none placeholder:text-[var(--mentra-text-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={
                    !input.trim() ||
                    isTyping
                  }
                  className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>

              </div>

              <p className="mt-2 text-center text-xs text-[var(--mentra-text-subtle)]">
                Press Enter to send • Shift + Enter for a new line
              </p>

            </form>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

function WelcomeState({ onPrompt }) {
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
        Ask me to explain a concept, help with code,
        quiz you, or create a study strategy for your
        learning journey.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">

        {quickPrompts.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() =>
                onPrompt(item.prompt)
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
