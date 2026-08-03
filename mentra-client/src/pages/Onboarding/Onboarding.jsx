import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGenerateRoadmap } from "../../hooks/useGenerateRoadmap";

export default function Onboarding() {
  const navigate = useNavigate();


const roadmapMutation = useGenerateRoadmap();

  const [form, setForm] = useState({
    career: "",
    level: "beginner",
    goal: "",
  });



async function handleSubmit(e) {
  e.preventDefault();

  console.log("Generate button clicked");

  roadmapMutation.mutate(form, {
    onSuccess: () => {
      navigate("/dashboard");
    },
  });
}

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-8">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl bg-[#18181B] border border-white/10 p-10"
      >

        <h1 className="text-4xl font-black text-white">

          Welcome to Mentra 👋

        </h1>

        <p className="mt-3 text-slate-400">

          Let's build your personalized roadmap.

        </p>

        <div className="mt-8 space-y-6">

          <input
            className="w-full rounded-xl bg-[#222] p-4 text-white outline-none"
            placeholder="Career (AI Engineer)"
            value={form.career}
            onChange={(e) =>
              setForm({
                ...form,
                career: e.target.value,
              })
            }
          />

          <select
            className="w-full rounded-xl bg-[#222] p-4 text-white"
            value={form.level}
            onChange={(e) =>
              setForm({
                ...form,
                level: e.target.value,
              })
            }
          >
            <option value="beginner">
              Beginner
            </option>

            <option value="intermediate">
              Intermediate
            </option>

            <option value="advanced">
              Advanced
            </option>

          </select>

          <input
            className="w-full rounded-xl bg-[#222] p-4 text-white outline-none"
            placeholder="Goal"
            value={form.goal}
            onChange={(e) =>
              setForm({
                ...form,
                goal: e.target.value,
              })
            }
          />

          <button
           disabled={roadmapMutation.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 p-4 font-bold text-white"
          >

           {roadmapMutation.isPending
  ? "Generating..."
  : "Generate Roadmap"}

          </button>

        </div>

      </form>

    </div>
  );
}