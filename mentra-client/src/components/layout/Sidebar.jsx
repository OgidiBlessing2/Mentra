import {
  LayoutDashboard,
  Route,
  BookOpen,
  Bookmark,
  MessageSquare,
  FolderKanban,
  Brain,
  Settings,
  Sparkles,
  ChevronRight,
  StickyNote,
  X,
} from "lucide-react";

import { useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard.js";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const { data } = useDashboard();

  const currentRoadmapId =
    data?.dashboard?.currentRoadmap?.id;

  const { user } = useUser();

  const currentLessonId =
    data?.dashboard?.currentLesson?.id;

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Learning Path",
      icon: Route,
      path: currentRoadmapId
        ? `/roadmaps/${currentRoadmapId}`
        : "/dashboard",
    },
    {
      name: "Lessons",
      icon: BookOpen,
      path: currentLessonId
        ? `/lessons/${currentLessonId}`
        : "/dashboard",
    },
    {
      name: "Bookmarks",
      icon: Bookmark,
      path: "/bookmarks",
    },
    {
      name: "Notes",
      icon: StickyNote,
      path: "/notes",
    },
    {
      name: "AI Mentor",
      icon: MessageSquare,
      path: "/mentor",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      name: "Flashcards",
      icon: Brain,
      path: "/flashcards",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
      {/* ============================= */}
      {/* MOBILE OVERLAY */}
      {/* ============================= */}

      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* ============================= */}
      {/* SIDEBAR */}
      {/* ============================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 shrink-0 flex-col
          border-r border-[var(--mentra-border)]
          bg-[var(--mentra-surface)]
          transition-transform duration-300
          lg:static lg:flex
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ============================= */}
        {/* MOBILE CLOSE */}
        {/* ============================= */}

        <div className="flex justify-end p-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-[var(--mentra-text-muted)] transition hover:bg-black/5 hover:text-[var(--mentra-text)]"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        {/* ============================= */}
        {/* LOGO */}
        {/* ============================= */}

        <div className="flex items-center justify-between px-6 pb-8 pt-4 lg:px-8 lg:pb-10 lg:pt-8">

          <div className="flex items-center gap-3">

            {/* Logo */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
              <Sparkles
                className="text-white"
                size={22}
              />
            </div>

            {/* Brand */}
            <div>
              <h1 className="text-2xl font-black text-[var(--mentra-text)]">
                Mentra
              </h1>

              <p className="text-sm text-[var(--mentra-text-muted)]">
                Learn Smarter
              </p>
            </div>

          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-[var(--mentra-text-muted)] transition hover:bg-black/5 hover:text-[var(--mentra-text)] lg:hidden"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>

        </div>

        {/* ============================= */}
        {/* NAVIGATION */}
        {/* ============================= */}

        <nav className="flex-1 space-y-2 overflow-y-auto px-4">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20"
                      : "text-[var(--mentra-text-muted)] hover:bg-black/5 hover:text-[var(--mentra-text)]"
                  }`
                }
              >

                <div className="flex items-center gap-4">

                  <Icon size={20} />

                  <span className="font-medium">
                    {item.name}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="opacity-0 transition group-hover:opacity-100"
                />

              </NavLink>
            );
          })}

        </nav>

        {/* ============================= */}
        {/* USER */}
        {/* ============================= */}

        <div className="border-t border-[var(--mentra-border)] p-5">

          <div className="rounded-3xl bg-black/5 p-4">

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 font-bold text-white">
                {user?.firstName?.charAt(0) || "M"}
              </div>

              {/* User information */}
              <div className="min-w-0">

                <h3 className="truncate font-semibold text-[var(--mentra-text)]">
                  {user?.firstName || "User"}
                </h3>

                <p className="truncate text-sm text-[var(--mentra-text-muted)]">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>

              </div>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
}