import { Sparkles, ArrowRight } from "lucide-react";

export default function AIMentorCard() {
  return (
    <div className="rounded-[30px] bg-gradient-to-br from-violet-700 via-indigo-700 to-cyan-600 p-8">

      <Sparkles
        className="text-white"
        size={40}
      />

      <h2 className="mt-8 text-3xl font-black text-white">

        AI Mentor

      </h2>

      <p className="mt-4 text-indigo-100">

        Ask questions, explain concepts,
        generate quizzes and get instant help.

      </p>

      <button className="mt-8 flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-violet-700 font-semibold hover:scale-105 transition">

        Chat with AI

        <ArrowRight size={20} />

      </button>

    </div>
  );
}