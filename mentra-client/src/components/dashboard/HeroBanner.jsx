import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-700 via-indigo-700 to-cyan-600 p-10 shadow-2xl shadow-violet-900/40">

      {/* Glow */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">

        <div className="max-w-2xl">

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">

            <Sparkles size={16} />

            AI Powered Learning

          </div>

          <h1 className="mt-6 text-5xl font-black leading-tight text-white">

            Continue Your

            <br />

            AI Engineer Journey 🚀

          </h1>

          <p className="mt-5 max-w-xl text-lg text-indigo-100">

            Every lesson completed unlocks your next milestone.
            Keep building your roadmap and become an AI Engineer.

          </p>

          <button className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-violet-700 transition hover:scale-105">

            Continue Learning

            <ArrowRight size={20} />

          </button>

        </div>

        {/* Right */}

        <div className="hidden xl:flex flex-col items-center">

          <div className="rounded-3xl bg-white/10 backdrop-blur-xl p-8 border border-white/20">

            <h3 className="text-indigo-100">

              Overall Progress

            </h3>

            <div className="mt-4 text-6xl font-black text-white">

              42%

            </div>

            <div className="mt-6 h-3 w-72 rounded-full bg-white/20">

              <div className="h-full w-[42%] rounded-full bg-white" />

            </div>

            <p className="mt-4 text-indigo-100">

              18 lessons completed

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}