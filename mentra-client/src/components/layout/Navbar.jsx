import {
  Bell,
  Search,
  Moon,
  Sparkles,
  Menu,
} from "lucide-react";

import { UserButton } from "@clerk/clerk-react";

export default function Navbar({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => {
              console.log("MENU CLICKED");
              setSidebarOpen(true);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#18181B] text-slate-300 transition hover:bg-[#222] hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white sm:text-2xl">
              Welcome Back 👋
            </h1>

            <p className="hidden truncate text-slate-400 sm:block">
              Continue building your AI career.
            </p>
          </div>

        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#18181B] px-4 py-3 lg:flex lg:w-72 xl:w-80">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search lessons..."
              className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {/* AI */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 transition hover:scale-105 sm:h-12 sm:w-12 sm:rounded-2xl"
            aria-label="AI Mentor"
          >
            <Sparkles
              size={18}
              className="text-white sm:h-5 sm:w-5"
            />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#18181B] transition hover:bg-[#222] sm:flex sm:h-12 sm:w-12 sm:rounded-2xl"
            aria-label="Notifications"
          >
            <Bell
              size={20}
              className="text-slate-300"
            />
          </button>

          {/* Theme */}
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#18181B] transition hover:bg-[#222] sm:flex sm:h-12 sm:w-12 sm:rounded-2xl"
            aria-label="Toggle theme"
          >
            <Moon
              size={20}
              className="text-slate-300"
            />
          </button>

          {/* Avatar */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 sm:h-12 sm:w-12",
              },
            }}
          />

        </div>

      </div>
    </header>
  );
}