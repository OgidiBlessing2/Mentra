import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  "Understanding your career goals",
  "Selecting the best learning path",
  "Designing your learning modules",
  "Preparing projects",
];

export default function RoadmapGenerating() {
  const [progress, setProgress] = useState(8);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 1;
      });
    }, 220);

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, 3000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050816] flex items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10">

        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Brain className="text-emerald-400" size={42} />
          </div>
        </div>

        <h1 className="mt-6 text-center text-3xl font-bold text-white">
          Mentra AI
        </h1>

        <p className="mt-3 text-center text-slate-400">
          Building your personalized roadmap...
        </p>

        <div className="mt-10 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 text-center text-sm text-slate-400">
          {progress}%
        </div>

        <div className="mt-10 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3"
            >
              {index < activeStep ? (
                <div className="text-emerald-400">✓</div>
              ) : index === activeStep ? (
                <div className="animate-pulse text-yellow-400">⏳</div>
              ) : (
                <div className="text-slate-500">○</div>
              )}

              <span
                className={
                  index <= activeStep
                    ? "text-white"
                    : "text-slate-500"
                }
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          This usually takes 10–20 seconds.
        </p>
      </div>
    </div>
  );
}