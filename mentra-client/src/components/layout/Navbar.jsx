import {
  Bell,
  Search,
  Moon,
  Sparkles,
} from "lucide-react";

import { UserButton } from "@clerk/clerk-react";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/10">

      <div className="h-20 px-8 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-6">

          <div>

            <h1 className="text-2xl font-bold text-white">

              Welcome Back 👋

            </h1>

            <p className="text-slate-400">

              Continue building your AI career.

            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* Search */}

          <div className="hidden lg:flex items-center gap-3 bg-[#18181B] border border-white/10 rounded-2xl px-4 py-3 w-80">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search lessons..."
              className="bg-transparent outline-none text-white placeholder:text-slate-500 flex-1"
            />

          </div>

          {/* AI */}

          <button className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 hover:scale-105 transition">

            <Sparkles
              size={20}
              className="text-white"
            />

          </button>

          {/* Notifications */}

          <button className="w-12 h-12 rounded-2xl bg-[#18181B] border border-white/10 flex items-center justify-center hover:bg-[#222] transition">

            <Bell
              size={20}
              className="text-slate-300"
            />

          </button>

          {/* Theme */}

          <button className="w-12 h-12 rounded-2xl bg-[#18181B] border border-white/10 flex items-center justify-center hover:bg-[#222] transition">

            <Moon
              size={20}
              className="text-slate-300"
            />

          </button>

          {/* Avatar */}

         <UserButton
  appearance={{
    elements: {
      avatarBox: "w-12 h-12",
    },
  }}
/>

        </div>

      </div>

    </header>
  );
}