
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Brain,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AIMentorCard() {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-700 via-indigo-700 to-cyan-600 p-6 shadow-2xl shadow-violet-900/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-900/30 sm:p-8">
      {/* Background effects */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:bg-white/15" />

      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl">
            <Sparkles size={28} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            AI Online
          </div>
        </div>

        {/* Content */}
        <h2 className="mt-8 text-3xl font-black text-white sm:text-4xl">
          AI Mentor
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">
          Ask questions, understand difficult concepts, generate quizzes,
          and get instant personalized help while you learn.
        </p>

        {/* Capabilities */}
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Feature
            icon={MessageCircle}
            text="Ask anything"
          />

          <Feature
            icon={Brain}
            text="Explain concepts"
          />

          <Feature
            icon={Zap}
            text="Generate quizzes"
          />
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigate("/mentor")}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-violet-700 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl sm:w-auto"
        >
          Chat with AI
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <Icon
        size={17}
        className="shrink-0 text-white"
      />

      <span className="text-sm font-medium text-indigo-50">
        {text}
      </span>
    </div>
  );
}
