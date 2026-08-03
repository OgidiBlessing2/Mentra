import { ArrowRight, Clock } from "lucide-react";

export default function ContinueLearning() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[#18181B] p-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400">

            Continue Learning

          </p>

          <h2 className="mt-2 text-3xl font-black text-white">

            Python Variables

          </h2>

        </div>

        <div className="rounded-2xl bg-violet-600/20 p-4">

          <Clock
            className="text-violet-400"
            size={28}
          />

        </div>

      </div>

      <div className="mt-8">

        <div className="flex justify-between mb-3">

          <span className="text-slate-400">

            Progress

          </span>

          <span className="text-white">

            75%

          </span>

        </div>

        <div className="h-3 rounded-full bg-[#262626]">

          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />

        </div>

      </div>

      <button className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white font-semibold hover:scale-105 transition">

        Continue Lesson

        <ArrowRight size={20} />

      </button>

    </div>
  );
}