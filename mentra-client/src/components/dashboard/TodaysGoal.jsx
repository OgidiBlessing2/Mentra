import { Target } from "lucide-react";

export default function TodaysGoal() {
  return (
    <div className="rounded-[30px] bg-[#18181B] border border-white/10 p-8">

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-cyan-500/20 p-4">

          <Target
            className="text-cyan-400"
            size={24}
          />

        </div>

        <div>

          <h2 className="text-white text-2xl font-bold">

            Today's Goal

          </h2>

          <p className="text-slate-400">

            Finish 2 lessons

          </p>

        </div>

      </div>

      <div className="mt-8 h-3 rounded-full bg-[#262626]">

        <div className="w-1/2 h-full rounded-full bg-cyan-500" />

      </div>

      <p className="mt-4 text-slate-300">

        1 / 2 completed

      </p>

    </div>
  );
}