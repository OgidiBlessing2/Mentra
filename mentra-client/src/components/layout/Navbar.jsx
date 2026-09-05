import { useEffect, useState } from "react";

import {
  Bell,
  Search,
  Moon,
  Sun,
  Sparkles,
  Menu,
  X,
  FolderKanban,
  Map,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

import { UserButton, useAuth } from "@clerk/clerk-react";

import { searchProjects } from "../../api/project.api.js";
import { searchRoadmaps } from "../../api/roadmap.api.js";

export default function Navbar({ setSidebarOpen }) {
  const { getToken } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [projectResults, setProjectResults] = useState([]);
  const [roadmapResults, setRoadmapResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setProjectResults([]);
      setRoadmapResults([]);
      setIsSearching(false);
      setSearchOpen(false);
      return;
    }

    setSearchOpen(true);

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);

        const token = await getToken();

        const [projectData, roadmapData] = await Promise.all([
          searchProjects(token, query),
          searchRoadmaps(token, query),
        ]);

        setProjectResults(projectData.projects || []);
        setRoadmapResults(roadmapData.roadmaps || []);
      } catch (error) {
        console.error(
          "❌ SEARCH ERROR:",
          error?.response?.data || error
        );

        setProjectResults([]);
        setRoadmapResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, getToken]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--mentra-border)] bg-[var(--mentra-bg)]/80 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* ============================= */}
        {/* LEFT SIDE */}
        {/* ============================= */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => {
              console.log("MENU CLICKED");
              setSidebarOpen(true);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] text-[var(--mentra-text-muted)] transition hover:bg-black/5 hover:text-[var(--mentra-text)] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          {/* Welcome */}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[var(--mentra-text)] sm:text-2xl">
              Welcome Back 👋
            </h1>

            <p className="hidden truncate text-[var(--mentra-text-muted)] sm:block">
              Continue building your AI career.
            </p>
          </div>
        </div>

        {/* ============================= */}
        {/* RIGHT SIDE */}
        {/* ============================= */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* ============================= */}
          {/* GLOBAL SEARCH */}
          {/* ============================= */}

          <div className="relative hidden lg:block lg:w-72 xl:w-80">

            {/* Search Input */}
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] px-4 py-3 transition focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/10">

              <Search
                size={18}
                className="shrink-0 text-[var(--mentra-text-muted)]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setSearchOpen(true);
                  }
                }}
                placeholder="Search Mentra..."
                className="flex-1 bg-transparent text-[var(--mentra-text)] outline-none placeholder:text-[var(--mentra-text-subtle)]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  className="text-[var(--mentra-text-subtle)] transition hover:text-[var(--mentra-text)]"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* ============================= */}
            {/* SEARCH DROPDOWN */}
            {/* ============================= */}

            {searchOpen && search.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] shadow-2xl shadow-black/40">

                {/* LOADING */}
                {isSearching && (
                  <div className="flex items-center gap-3 px-5 py-5">

                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-violet-500" />

                    <p className="text-sm text-[var(--mentra-text-muted)]">
                      Searching Mentra...
                    </p>

                  </div>
                )}

                {/* ============================= */}
                {/* PROJECT RESULTS */}
                {/* ============================= */}

                {!isSearching &&
                  projectResults.length > 0 && (
                    <div className="p-2">

                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--mentra-text-subtle)]">
                        Projects
                      </p>

                      {projectResults.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-black/5"
                        >

                          {/* Icon */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <FolderKanban size={18} />
                          </div>

                          {/* Content */}
                          <div className="min-w-0">

                            <p className="truncate font-medium text-[var(--mentra-text)]">
                              {project.title}
                            </p>

                            <p className="truncate text-xs text-[var(--mentra-text-subtle)]">
                              {project.description || "Project"}
                            </p>

                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                {/* ============================= */}
                {/* ROADMAP RESULTS */}
                {/* ============================= */}

                {!isSearching &&
                  roadmapResults.length > 0 && (
                    <div className="border-t border-[var(--mentra-border)] p-2">

                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--mentra-text-subtle)]">
                        Roadmaps
                      </p>

                      {roadmapResults.map((roadmap) => (
                        <button
                          key={roadmap.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-black/5"
                        >

                          {/* Icon */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Map size={18} />
                          </div>

                          {/* Content */}
                          <div className="min-w-0">

                            <p className="truncate font-medium text-[var(--mentra-text)]">
                              {roadmap.title}
                            </p>

                            <p className="truncate text-xs text-[var(--mentra-text-subtle)]">
                              {roadmap.career ||
                                roadmap.goal ||
                                "Learning roadmap"}
                            </p>

                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                {/* ============================= */}
                {/* NO RESULTS */}
                {/* ============================= */}

                {!isSearching &&
                  search.trim() &&
                  projectResults.length === 0 &&
                  roadmapResults.length === 0 && (
                    <div className="px-5 py-8 text-center">

                      <Search
                        size={24}
                        className="mx-auto mb-3 text-[var(--mentra-text-subtle)]"
                      />

                      <p className="text-sm font-medium text-[var(--mentra-text-muted)]">
                        No results found
                      </p>

                      <p className="mt-1 text-xs text-[var(--mentra-text-subtle)]">
                        Try searching for another project or roadmap.
                      </p>

                    </div>
                  )}

              </div>
            )}
          </div>

          {/* ============================= */}
          {/* AI MENTOR */}
          {/* ============================= */}

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

          {/* ============================= */}
          {/* NOTIFICATIONS */}
          {/* ============================= */}

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] transition hover:bg-black/5 sm:flex sm:h-12 sm:w-12 sm:rounded-2xl"
            aria-label="Notifications"
          >
            <Bell
              size={20}
              className="text-[var(--mentra-text-muted)]"
            />
          </button>

          {/* ============================= */}
          {/* THEME */}
          {/* ============================= */}

          <button
            type="button"
            onClick={toggleTheme}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] transition hover:bg-black/5 sm:flex sm:h-12 sm:w-12 sm:rounded-2xl"
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun
                size={20}
                className="text-[var(--mentra-text-muted)]"
              />
            ) : (
              <Moon
                size={20}
                className="text-[var(--mentra-text-muted)]"
              />
            )}
          </button>

          {/* ============================= */}
          {/* USER AVATAR */}
          {/* ============================= */}

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